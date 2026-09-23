# Feedants Competition Details Screen - Functional Full-Stack Module

A full-stack, production-grade module replicating the **Feedants Classical Dance** competition details screen with 100% visual fidelity, dynamic MongoDB state management, and strict concurrency control preventing race conditions and overbooking.

Built for the **Feedants Full Stack Development Internship Technical Assignment**.

---

## Table of Contents
1. [Overview & Key Features](#overview--key-features)
2. [Design & Visual Fidelity](#design--visual-fidelity)
3. [Architecture & Concurrency Handling](#architecture--concurrency-handling)
4. [Project Structure](#project-structure)
5. [Setup & Running Instructions](#setup--running-instructions)
6. [Environment Variables & Configuration](#environment-variables--configuration)
7. [Automated Concurrency Stress Testing](#automated-concurrency-stress-testing)
8. [Technical Analysis & Design Decisions](#technical-analysis--design-decisions)
   - [Important Assumptions Made](#1-important-assumptions-made)
   - [Major Technical Decisions](#2-major-technical-decisions)
   - [Trade-offs Considered](#3-trade-offs-considered)
   - [Production Improvements & Roadmap](#4-production-improvements--roadmap)

---

## Overview & Key Features

This application goes beyond reproducing the visual UI by serving dynamic data through a Node.js + Express backend and MongoDB database, addressing real-world edge cases and high-concurrency loads:

- **Fully Dynamic**: All competition information (Title, Tags, Prize Pool, Entry Fee, Spots, Dates, Judge profile, Previous Winners, Tab contents, Rewards, Referral link) is served dynamically through MongoDB. Zero hardcoded data.
- **Cross-Platform React Native**: Built using React Native (with Expo & React Native Web), providing an authentic mobile app experience that runs seamlessly on Android, iOS, and desktop web browsers.
- **State-Driven Interactions**: 
  - Logged-in registered users see the `✓ Registered` badge and `"Upload Submission"` CTA.
  - Unregistered users see `Register Now` and `"Register Now - ₹99"`, opening an interactive simulated Razorpay payment modal.
- **Dynamic State Machine**: Automatically computes lifecycle states (`REGISTRATION_OPEN`, `SUBMISSION_OPEN`, `UNDER_REVIEW`, `COMPLETED`, `HOUSEFULL`) based on current timestamps versus milestone dates.
- **Comprehensive Dual Localization**: Seamless toggle between English (`ENG`) and Hindi (`हिंदी`) covering 100% of UI sentences, badges, titles, dates, rules, judging criteria, previous winner ranks, modals, and alerts.
- **Clean In-App Reviewer Dock**: Embedded directly within the app via a sleek, unobtrusive floating capsule pill (`[ Reviewer Dock ]`) and slide-up sheet. The main UI stays 100% clean and authentic. Evaluators can switch demo users, preview all 6 competition lifecycle states, run live concurrency spikes, and reset states with 1 click. Can also be summoned anytime via secret gestures (triple-tap "Go back" or long-press the title).

---

## Design & Visual Fidelity

Every visual element matches the provided Feedants design reference:
- **Header**: Clean header starting directly with **"← Go back"** and the active teal **`ENG | हिंदी`** language capsule toggle (status bar icons removed as per specification).
- **Top Unified Card**: Encloses Title (**Feedants Classical Dance**), Registration pill badge (`✓ Registered`), Tags (`Dance`, `Multi-Win`, `Winners get certificate`), **Prize Pool** (`₹ 1,500`), **Entry Fee** (`₹ 99`), and the **Spots Left Meter** (`Only 19 spots left`, animated progress track, and `1 / 20 Booked`).
- **Judge Card**: Portrait avatar of **Manju Dubey** in authentic Kathak dancer traditional attire and circular **Intro Video** player button.
- **Countdown Banner**: Soft mint background displaying real-time live ticker (`01d : 06h : 28m : 32s`) with optimized internal spacing and dynamic status badges (`Hurry up!`, `Evaluating`, or `Concluded`).
- **Important Dates Card (Single Unified Card)**: Clean card enclosing the `"Important Dates"` title and a 2x2 grid (Register Before, Submission Starts, Submission Ends, Result Date) with 2-line date/time values.
- **Previous Winners Card (Single Unified Card)**: Clean card enclosing the `"Previous Winners"` title and a horizontal scroll of performer thumbnails, overlay play buttons, names, and rank badges in teal.
- **Content Tabs Card (Single Unified Card)**: Clean card enclosing 3 tabs (`About Competition`, `Judging Parameters`, `Rules & Eligibility`), active teal underline indicator, and collapsible body text with `"View more ∨"` / `"View less ∧"`.
- **Rewards Section**: Ranked prizes (`1st: ₹550`, `2nd: ₹300`, `3rd: ₹240`, `4th: ₹200`, `5th: ₹130`, `6th: ₹80`) with soft mint disclaimer banner.
- **Trust & Payment Card**: Two-column layout with "How will you receive prize money?", custom **Shield with checkmark** icon, and the official two-tone **Razorpay** emblem (`#0C2340` dark navy polygon + `#2B85FF` electric blue blade) and wordmark.
- **Referral Section**: Mint card with custom **Mint Megaphone** icon, `https://feedants.com/r/referral123` copyable link box, and `Refer Now` CTA.
- **User Reviews**: Card with custom **Speech Bubble with Eyes** (`● ●`) icon and reviews modal.
- **Sticky Bottom Action Bar**: Mini `Ad Here` promo card + primary CTA button (`Upload Submission / Registered` or `Register Now - ₹99`).
- **Bottom Navigation**: Fixed bar with `Home`, `Explore`, `(+)`, `Competitions` (active), and `Profile`.

---

## Architecture & Concurrency Handling

The assignment explicitly requires designing for **thousands of concurrent users** and handling concurrent registrations without race conditions or overbooking.

### Race Condition Mitigation
In naive implementations, a "read-then-write" query (`if spotsLeft > 0 then save`) fails under concurrent load because multiple incoming requests read `spotsLeft = 1` before any write completes, leading to overbooking (e.g. 25/20 booked).

### Our Solution: MongoDB Atomic Operations
In `backend/src/controllers/competitionController.js`:
```javascript
// ATOMIC CAPACITY CHECK & RESERVATION
const updatedCompetition = await Competition.findOneAndUpdate(
  {
    _id: id,
    $expr: { $lt: ['$bookedSpots', '$totalSpots'] }
  },
  {
    $inc: { bookedSpots: 1 }
  },
  { new: true }
);

// If null, capacity was reached at that exact millisecond
if (!updatedCompetition) {
  return res.status(409).json({
    success: false,
    message: 'Sorry! The competition just became fully booked. No spots remaining.'
  });
}
```

- **Unique Compound Index**: `{ competitionId: 1, userId: 1 }` on the `Registration` model guarantees at the database engine level that a user cannot be registered twice.
- **Atomic Rollback**: If the subsequent registration transaction or payment validation fails, the booked counter is atomically rolled back via `$inc: { bookedSpots: -1 }`.

---

## Project Structure

```
Competition_Details_Screen/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Competition.js          # Competition schema, virtuals, lifecycle methods
│   │   │   ├── Registration.js         # Compound index { competitionId: 1, userId: 1 }
│   │   │   ├── Submission.js           # User entry submissions schema
│   │   │   └── User.js                 # User profile schema
│   │   ├── controllers/
│   │   │   └── competitionController.js # Atomic spot reservation & lifecycle logic
│   │   ├── routes/
│   │   │   ├── competitionRoutes.js    # /api/competitions routes
│   │   │   └── userRoutes.js           # /api/users routes
│   │   ├── seedHelper.js               # Seed data matching reference design
│   │   ├── seed.js                     # Standalone re-seeder script
│   │   └── server.js                   # Express server entry point & Mongo connection
│   ├── test/
│   │   └── concurrency_test.js         # Automated 29-user concurrent flood test
│   ├── .env                            # Backend environment configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── competitionApi.js       # REST client for backend endpoints
│   │   ├── context/
│   │   │   ├── LanguageContext.js      # ENG / हिंदी multilingual dictionary
│   │   │   └── UserContext.js          # Switchable active user session
│   │   └── components/
│   │       ├── Header.jsx              # Clean header with Go Back and Language pill
│   │       ├── CompetitionHeader.jsx   # Top unified card (Title, Tags, Prize, Spots)
│   │       ├── JudgeCard.jsx           # Judge profile & Intro Video button
│   │       ├── CountdownTimer.jsx      # Dynamic 1s ticker with balanced spacing
│   │       ├── ImportantDates.jsx      # Single unified card (2x2 grid)
│   │       ├── PreviousWinners.jsx    # Single unified card (horizontal winners)
│   │       ├── ContentTabs.jsx         # Single unified card (3 tabs + expandable text)
│   │       ├── RewardsSection.jsx      # Rewards list (1st to 6th) + disclaimer
│   │       ├── TrustAndPaymentSection.jsx # Two-column trust card
│   │       ├── ShieldCheckIcon.jsx     # Custom vector shield with checkmark icon
│   │       ├── RazorpayLogo.jsx        # Official two-tone Razorpay emblem & wordmark
│   │       ├── ReferralSection.jsx     # Referral card with copy link & CTA
│   │       ├── MegaphoneIcon.jsx       # Custom mint megaphone vector icon
│   │       ├── ReviewsSection.jsx      # User reviews card
│   │       ├── SpeechBubbleFaceIcon.jsx# Custom speech bubble with two eyes vector icon
│   │       ├── StickyBottomBar.jsx     # "Ad Here" card + dynamic CTA
│   │       ├── BottomNavBar.jsx        # App navigation bar (Home, Explore, +, Competitions, Profile)
│   │       ├── DemoControlPanel.jsx    # Clean in-app reviewer test bench dock
│   │       ├── RegistrationModal.jsx   # Payment simulation dialog
│   │       ├── SubmissionModal.jsx     # Performance video upload modal
│   │       └── VideoModal.jsx          # Judge video preview modal
│   ├── App.js                          # Root mobile viewport & screen assembly
│   └── package.json
└── README.md
```

---

## Setup & Running Instructions

### Prerequisites
- **Node.js**: v18 or higher (tested on v22.12.0)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install

# Seed initial assignment data (runs automatically on server launch if DB is empty)
npm run seed

# Start the server (runs on http://localhost:5000)
npm start
```
*Health Check*: `http://localhost:5000/health`  
*API Featured Competition*: `http://localhost:5000/api/competitions/featured`

### 2. Frontend Setup (React Native / Expo Web)
```bash
cd frontend
npm install

# Start on web browser (Chrome / Edge / Safari)
npm run web

# Or start on Android / iOS
npm run android
npm run ios
```
Open `http://localhost:8081` in your browser. The app displays in a mobile phone viewport frame with touch scrolling.

### 3. Clean In-App Reviewer Dock
To keep the screen 100% clean and faithful to the Feedants mobile app design while making the reviewer dock accessible on all mobile screens and desktop:
- **Unobtrusive Floating Pill**: Subtle dark-glass capsule (`[ Reviewer Dock ]`) floating above the bottom bar with zero clutter.
- **Slide-up Reviewer Sheet**: Tapping the pill opens an elegant modal sheet organized into 3 segmented tabs:
  - **Users Tab**: Instant 1-tap switching between demo users (Ananya Sharma [registered], Rohan Patel, Priya Iyer, Vikram Malhotra, Sneha Reddy [unregistered]).
  - **Lifecycle Tab**: Preview all 6 competition lifecycle states with 1 click (`Open`, `1 Spot Left`, `Housefull`, `Submissions Open`, `Judging Mode`, `Results Declared`).
  - **Concurrency & Reset Tab**: Fire 10 simultaneous registration requests to see real-time atomic capacity guarding and race condition prevention, or reset to pristine defaults.
- **Developer Gestures**:
  - **Triple-tap "Go back"**: Instantly toggles the Reviewer Dock.
  - **Long-press Competition Title**: Instantly toggles the Reviewer Dock.
  - **Hide Floating Pill**: Evaluators can toggle off the floating pill for 100% pristine visual inspections and summon the dock purely via gestures.

---

## Environment Variables & Configuration

The backend reads configuration from `backend/.env`:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for the Express API server |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/feedants_competition` | MongoDB connection connection string |
| `NODE_ENV` | `development` | Environment runtime mode |

---

## Automated Concurrency Stress Testing

An automated concurrency test script is included to prove that concurrent registration requests cannot overbook the competition.

### Running the Test
```bash
cd backend
npm run test:concurrency
```

### Test Methodology & Output
1. The test fetches the featured competition (20 total spots, 1 already booked = 19 spots available).
2. Generates **29 unique test user accounts** (10 more than the available spots).
3. Simultaneously fires **29 concurrent HTTP POST requests** to `/api/competitions/:id/register` via `Promise.all`.
4. Validates the results directly against the database:

```
===============================================================
FEEDANTS CONCURRENCY STRESS TEST - RACE CONDITION VALIDATION
===============================================================

[1] Fetching competition status...
[OK] Competition: "Feedants Classical Dance"
[OK] Total Spots: 20, Currently Booked: 1
[OK] Available Spots Before Test: 19

[2] Preparing 29 distinct concurrent users (Available spots: 19)...
[OK] Created 29 test users.

[3] FIRING 29 CONCURRENT REGISTRATION REQUESTS SIMULTANEOUSLY...

[4] Concurrency Test Completed in 275ms:
  - Successful Bookings (HTTP 201): 19
  - Blocked by Capacity Check (HTTP 409): 10
  - Unexpected Failures: 0

[5] Database State Verification:
  - DB bookedSpots counter: 20 (Max allowed: 20)
  - Actual Registration records in DB: 20

[PASS] TEST PASSED: 100% DATA CONSISTENCY GUARANTEED!
   - Exactly zero overbookings occurred.
   - Atomic MongoDB update handled simultaneous requests without race conditions.
   - Exactly 19 succeeded and 10 were safely rejected.
```

---

## Technical Analysis & Design Decisions

### 1. Important Assumptions Made
1. **Flash-Sale Booking Behavior**: In limited-seat competitions, spots must be locked atomically before proceeding to payment. In this submission, the atomic reservation happens upon clicking "Pay & Confirm" in the modal.
2. **Dynamic Timelines**: Milestone dates (`registrationDeadline`, `submissionStartDate`, `submissionEndDate`, `resultDate`) determine the lifecycle state dynamically rather than relying on a static database flag.
3. **Cross-Platform Review Experience**: Built in React Native with Expo and `react-native-web` so evaluators can inspect and test the application directly in any desktop web browser while maintaining full compatibility with Android and iOS.

### 2. Major Technical Decisions
- **MongoDB Atomic Updates (`findOneAndUpdate` with `$expr`)**: Chosen over optimistic locking with version keys (`__v`). Optimistic concurrency causes high retry failure rates under simultaneous spikes. Document-level atomic updates serialize spot reservation directly at the database engine with zero retries needed.
- **Compound Unique Index**: `Registration` uses `{ competitionId: 1, userId: 1 }` with `{ unique: true }` to enforce single-entry rules at the storage engine level, preventing accidental double charges on rapid double-clicks.
- **Embedded Reviewer Test Bench**: Built an in-app developer dock ([`DemoControlPanel.jsx`](file:///d:/Competition_Details_Screen/frontend/src/components/DemoControlPanel.jsx)) so anyone testing the submission can switch users, trigger concurrency spikes, and test all lifecycle states (`Open`, `1 Spot Left`, `Housefull`, `Submissions Open`, `Judging`, `Results`) directly from the UI without manual database edits.
- **Pure React Native Architecture**: Kept the UI strictly within React Native primitives (`View`, `Text`, `StyleSheet`, `ScrollView`) for native performance and reusability across platforms.

### 3. Trade-offs Considered
- **Atomic In-Database Counter vs. Redis Distributed Counter**:
  - *Trade-off*: An in-memory Redis counter (`DECR spots_left`) offers sub-millisecond response times at extreme scale (100k+ req/sec). However, it introduces an extra infrastructure dependency.
  - *Decision*: MongoDB's atomic `findOneAndUpdate` with `$inc` handles several thousand concurrent requests with zero external infrastructure while maintaining ACID consistency. For multi-region enterprise deployments, Redis can be layered in front seamlessly.
- **Pre-signed Video Uploads vs. Multipart Streaming**:
  - *Trade-off*: Streaming 100MB+ dance videos through the Express API server consumes substantial network bandwidth and server memory.
  - *Decision*: For this submission, video URLs are submitted with metadata. In production, the client would request a short-lived S3 pre-signed URL and upload directly to cloud storage.

### 4. Production Improvements & Roadmap
If developing this feature further for millions of active users:
1. **Redis Caching & Distributed Locks**:
   - Cache `GET /api/competitions/:id` in Redis with a 10-second TTL to handle millions of read requests without touching MongoDB.
   - Use Redis `DECR` or Redlock for flash-sale reservation with a 5-minute checkout TTL.
2. **Event-Driven Webhook Processing (Kafka / RabbitMQ)**:
   - Offload Razorpay payment confirmation webhooks and automated email notifications to an asynchronous message broker.
3. **Direct S3 Pre-Signed Video Uploads & Automated Transcoding**:
   - Integrate AWS S3 pre-signed URLs with AWS MediaConvert to transcode uploaded classical dance performances into adaptive bitrate HLS/DASH streams for judging.
4. **Push Notifications**:
   - Automated push alerts (Firebase Cloud Messaging / Expo Notifications) when registration is closing in 1 hour or when judging results are declared.
