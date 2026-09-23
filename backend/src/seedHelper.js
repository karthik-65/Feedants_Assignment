const Competition = require('./models/Competition');
const User = require('./models/User');
const Registration = require('./models/Registration');

async function seedDatabase(force = false) {
  try {
    const existingCount = await Competition.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`[Seed] Database already contains ${existingCount} competition(s). Skipping seed.`);
      return;
    }

    if (force) {
      console.log('[Seed] Force seeding: clearing existing data...');
      await Competition.deleteMany({});
      await User.deleteMany({});
      await Registration.deleteMany({});
    }

    console.log('[Seed] Seeding initial users...');
    const users = await User.create([
      {
        name: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        phone: '+91 98765 43210',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
      },
      {
        name: 'Rohan Patel',
        email: 'rohan.patel@example.com',
        phone: '+91 98123 45678',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
      },
      {
        name: 'Priya Iyer',
        email: 'priya.iyer@example.com',
        phone: '+91 97234 56789',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram.m@example.com',
        phone: '+91 96345 67890',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        phone: '+91 95456 78901',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
      }
    ]);

    console.log('[Seed] Creating competition from clear design reference...');
    const now = Date.now();
    // 1 day 6 hours 28 mins 32 secs = 109712 seconds
    const remainingMs = (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000;

    const competition = await Competition.create({
      title: 'Feedants Classical Dance',
      category: 'Dance',
      tags: ['Dance', 'Multi-Win', 'Winners get certificate'],
      prizePool: 1500,
      entryFee: 99,
      currency: '₹',
      totalSpots: 20,
      bookedSpots: 1, // Exactly 1 / 20 Booked, Only 19 spots left as per image!
      status: 'REGISTRATION_OPEN',
      registrationDeadline: new Date(now + remainingMs),
      submissionStartDate: new Date(now - 2 * 86400 * 1000), // Active submissions
      submissionEndDate: new Date(now + remainingMs + 18 * 86400 * 1000),
      resultDate: new Date(now + remainingMs + 20 * 86400 * 1000),
      judge: {
        name: 'Manju Dubey',
        role: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        avatarUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      },
      previousWinners: [
        {
          name: 'Riya Shah',
          rank: '1st Winner',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
          score: 98
        },
        {
          name: 'Aarav Mehta',
          rank: '1st Winner',
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
          score: 96
        },
        {
          name: 'Neha Verma',
          rank: '2nd Winner',
          avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
          score: 93
        },
        {
          name: 'Ishita Ch...',
          rank: '3rd Winner',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
          score: 90
        }
      ],
      tabContent: {
        about: {
          en: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
          hi: 'यह सभी आयु समूहों के लिए खुली एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। कहीं से भी भाग लें और अपनी प्रतिभा का प्रदर्शन करें। पारंपरिक नृत्य के माध्यम से अपने जुनून को व्यक्त करें।'
        },
        judgingParameters: {
          en: '1. Expression (Bhava) - 30%: Mastery of emotive storytelling and facial gestures.\n2. Rhythm & Footwork (Tala & Laya) - 30%: Precision in footwork and synchronization with the beat.\n3. Grace & Costume (Angika) - 20%: Body alignment, posture, and traditional attire authenticity.',
          hi: '1. भाव (30%): भावनात्मक अभिव्यक्ति और चेहरे के हाव-भाव।\n2. लय और ताल (30%): ताल और लय के साथ कदमों का तालमेल।\n3. अंगिका और पोशाक (20%): मुद्रा, ग्रेस और पारंपरिक वेशभूषा।'
        },
        rulesAndEligibility: {
          en: '• Video duration must be between 2 to 5 minutes in length.\n• Solo performances only; no group dances allowed.\n• Clear video recorded in landscape orientation without edits or cuts.',
          hi: '• वीडियो की अवधि 2 से 5 मिनट के बीच होनी चाहिए।\n• केवल एकल (सोलो) प्रदर्शन मान्य हैं।\n• लैंडस्केप मोड में बिना किसी संपादन के स्पष्ट रिकॉर्डिंग होनी चाहिए।'
        }
      },
      rewards: [
        { rank: 1, title: '1st Winner', amount: 550, icon: 'trophy' },
        { rank: 2, title: '2nd Winner', amount: 300, icon: 'medal-silver' },
        { rank: 3, title: '3rd Winner', amount: 240, icon: 'medal-bronze' },
        { rank: 4, title: '4th Winner', amount: 200, icon: 'star' },
        { rank: 5, title: '5th Winner', amount: 130, icon: 'star' },
        { rank: 6, title: '6th Winner', amount: 80, icon: 'star' }
      ],
      disclaimer: 'Only contributions from paid participants will be considered for judging.',
      referralInfo: {
        code: 'referral123',
        link: 'https://feedants.com/r/referral123',
        discountText: 'You earn ₹10 for every signup'
      }
    });

    // Create the 1st booked registration (User Ananya Sharma is registered)
    await Registration.create({
      competitionId: competition._id,
      userId: users[0]._id,
      paymentStatus: 'PAID',
      amountPaid: 99,
      paymentReference: 'RZP_SEED_FIRST_BOOKING'
    });

    console.log('[Seed] Database successfully re-seeded with competition ID:', competition._id);
    return competition;
  } catch (error) {
    console.error('[Seed] Seeding error:', error);
  }
}

module.exports = seedDatabase;
