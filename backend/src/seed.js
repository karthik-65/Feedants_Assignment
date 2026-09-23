const mongoose = require('mongoose');
require('dotenv').config();
const seedDatabase = require('./seedHelper');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_competition';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for manual seeding...');
  await seedDatabase(true); // force reseed
  await mongoose.disconnect();
  console.log('Done!');
  process.exit(0);
}

run();
