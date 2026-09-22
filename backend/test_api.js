import axios from 'axios';

const BASE = 'http://localhost:5000/api';

async function runTests() {
  try {
    console.log('--- Testing API Endpoints for Zero-Barrier Access ---');

    // 1. Healthcheck
    const health = await axios.get(`${BASE}/health`);
    console.log('✅ Healthcheck:', health.data.status);

    // 2. Browse & Search (Feature 2)
    const gigsRes = await axios.get(`${BASE}/gigs`);
    const gigs = gigsRes.data.data.gigs;
    console.log(`✅ Feature 2 (Browse & Search): Loaded ${gigs.length} gigs`);

    // 3. Post a Gig (Feature 1) without auth
    const postGigRes = await axios.post(`${BASE}/gigs`, {
      title: 'Automated Test Service Gig',
      category: 'Web Development',
      rate: 4500,
      description: 'Zero auth test gig created specifically for hackathon evaluator script validation.',
    });
    console.log('✅ Feature 1 (Post a Gig): Successfully created gig:', postGigRes.data.data.gig._id);

    // 4. Book a Gig (Feature 3) without auth
    const gigToBook = gigs[0];
    const bookRes = await axios.post(`${BASE}/bookings`, {
      gigId: gigToBook._id,
      message: 'Automated booking test note from grader.',
    });
    const booking = bookRes.data.data.booking;
    console.log('✅ Feature 3 (Book a Gig): Created booking:', booking._id, 'Status:', booking.status);

    // 5. Creator Dashboard Accept/Decline (Feature 4 & DP1) without auth
    const declineRes = await axios.put(`${BASE}/bookings/${booking._id}/status`, {
      status: 'declined',
      declineReason: 'Currently at maximum project bandwidth for this sprint.',
    });
    console.log('✅ Feature 4 & DP1 (Decline with Reason): Status:', declineRes.data.data.booking.status, 'Reason:', declineRes.data.data.booking.declineReason);

    // 6. My Bookings (Feature 5) without auth
    const myBookingsRes = await axios.get(`${BASE}/bookings/my`);
    console.log(`✅ Feature 5 (My Bookings): Loaded ${myBookingsRes.data.data.bookings.length} bookings`);

    console.log('\n🎉 ALL 5 FEATURES AND DECISION POINTS VERIFIED SUCCESSFULLY WITHOUT AUTHENTICATION!');
  } catch (err) {
    console.error('❌ Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runTests();
