/**
 * Concurrency Stress Test for Feedants Competition Registration
 * Demonstrates zero overbooking and data consistency when concurrent requests exceed available spots.
 */
const mongoose = require('mongoose');
const http = require('http');

const SERVER_PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${SERVER_PORT}`;

// Helper to make HTTP POST request
function makePostRequest(urlPath, body) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(body);
    const options = {
      hostname: '127.0.0.1',
      port: SERVER_PORT,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });

    req.write(postData);
    req.end();
  });
}

function makeGetRequest(urlPath) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });
  });
}

async function runConcurrencyTest() {
  console.log('===============================================================');
  console.log('FEEDANTS CONCURRENCY STRESS TEST - RACE CONDITION VALIDATION');
  console.log('===============================================================');

  // 1. Fetch current featured competition
  console.log('\n[1] Fetching competition status...');
  const compRes = await makeGetRequest('/api/competitions/featured');
  if (compRes.status !== 200 || !compRes.body.data) {
    console.error('[ERROR] Failed to fetch competition from server at', BASE_URL);
    process.exit(1);
  }

  const competition = compRes.body.data;
  const compId = competition._id;
  console.log(`✓ Competition: "${competition.title}"`);
  console.log(`✓ Total Spots: ${competition.totalSpots}, Currently Booked: ${competition.bookedSpots}`);
  const spotsAvailable = competition.totalSpots - competition.bookedSpots;
  console.log(`✓ Available Spots Before Test: ${spotsAvailable}`);

  // 2. Create mock users for the concurrency flood
  const concurrentAttemptCount = spotsAvailable + 10; // 10 more than available!
  console.log(`\n[2] Preparing ${concurrentAttemptCount} distinct concurrent users (Available spots: ${spotsAvailable})...`);

  // Use MongoDB directly or API to get/create test users
  const User = require('../src/models/User');
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_competition';
  await mongoose.connect(MONGODB_URI);

  const testUsers = [];
  for (let i = 1; i <= concurrentAttemptCount; i++) {
    const email = `stress_user_${Date.now()}_${i}@example.com`;
    const user = await User.create({
      name: `Concurrent Participant #${i}`,
      email: email,
      phone: `+91 99999 ${String(i).padStart(5, '0')}`
    });
    testUsers.push(user);
  }
  console.log(`✓ Created ${testUsers.length} test users.`);

  // 3. Fire all requests concurrently via Promise.all
  console.log(`\n[3] FIRING ${concurrentAttemptCount} CONCURRENT REGISTRATION REQUESTS SIMULTANEOUSLY...`);
  const startTime = Date.now();

  const promises = testUsers.map(user =>
    makePostRequest(`/api/competitions/${compId}/register`, {
      userId: user._id.toString(),
      paymentMethod: 'Razorpay_StressTest'
    })
  );

  const results = await Promise.all(promises);
  const duration = Date.now() - startTime;

  // 4. Analyze results
  const successfulRegistrations = results.filter(r => r.status === 201);
  const rejectedDueToFull = results.filter(r => r.status === 409);
  const otherErrors = results.filter(r => r.status !== 201 && r.status !== 409);

  console.log(`\n[4] Concurrency Test Completed in ${duration}ms:`);
  console.log(`  - Successful Bookings (HTTP 201): ${successfulRegistrations.length}`);
  console.log(`  - Blocked by Capacity Check (HTTP 409): ${rejectedDueToFull.length}`);
  console.log(`  - Unexpected Failures: ${otherErrors.length}`);

  // 5. Query final state directly from DB to verify consistency
  const Competition = require('../src/models/Competition');
  const Registration = require('../src/models/Registration');

  const finalComp = await Competition.findById(compId);
  const totalRegistrationsInDB = await Registration.countDocuments({ competitionId: compId });

  console.log('\n[5] Database State Verification:');
  console.log(`  - DB bookedSpots counter: ${finalComp.bookedSpots} (Max allowed: ${finalComp.totalSpots})`);
  console.log(`  - Actual Registration records in DB: ${totalRegistrationsInDB}`);

  let testPassed = true;

  if (finalComp.bookedSpots > finalComp.totalSpots) {
    console.error(`[ERROR] CRITICAL FAILURE: Overbooking occurred! bookedSpots (${finalComp.bookedSpots}) > totalSpots (${finalComp.totalSpots})`);
    testPassed = false;
  } else if (finalComp.bookedSpots !== totalRegistrationsInDB) {
    console.error(`[ERROR] CRITICAL FAILURE: Counter mismatch! bookedSpots (${finalComp.bookedSpots}) !== Registration records (${totalRegistrationsInDB})`);
    testPassed = false;
  } else if (successfulRegistrations.length !== spotsAvailable) {
    console.error(`[ERROR] MISMATCH: Expected ${spotsAvailable} successes, got ${successfulRegistrations.length}`);
    testPassed = false;
  } else {
    console.log('\n[PASS] TEST PASSED: 100% DATA CONSISTENCY GUARANTEED!');
    console.log('   - Exactly zero overbookings occurred.');
    console.log('   - Atomic MongoDB update handled simultaneous requests without race conditions.');
    console.log(`   - Exactly ${spotsAvailable} succeeded and ${rejectedDueToFull.length} were safely rejected.`);
  }

  // Cleanup test users and registrations
  const testUserIds = testUsers.map(u => u._id);
  await Registration.deleteMany({ userId: { $in: testUserIds } });
  await User.deleteMany({ _id: { $in: testUserIds } });
  // Restore initial booked count (1)
  finalComp.bookedSpots = 1;
  await finalComp.save();
  console.log('\n[Cleanup] Test records cleaned and competition restored to initial demo state.');

  await mongoose.disconnect();
  process.exit(testPassed ? 0 : 1);
}

runConcurrencyTest().catch(console.error);
