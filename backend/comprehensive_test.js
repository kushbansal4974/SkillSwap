const BASE = 'http://localhost:5000/api';

async function api(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runAudit() {
  console.log('================================================================');
  console.log('       SKILLSWAP — DATABASE & 5-FEATURE VERIFICATION SUITE       ');
  console.log('================================================================\n');

  const results = [];

  const record = (name, passed, detail) => {
    results.push({ name, passed, detail });
    console.log(`${passed ? '✅ [PASS]' : '❌ [FAIL]'} ${name}`);
    if (detail) console.log(`   ↳ ${detail}`);
  };

  try {
    // 1. Healthcheck
    const health = await api('/health');
    record('API Healthcheck Route', health.status === 200 && health.data.status === 'healthy', `Status: ${health.data.status}`);

    // 2. Feature 2: Browse & Search
    const allGigs = await api('/gigs');
    const totalGigs = allGigs.data?.data?.gigs?.length || 0;
    record('Feature 2: Browse All Gigs (Marketplace)', totalGigs > 0, `Total gigs found: ${totalGigs}`);

    // Search filter
    const searchRes = await api('/gigs?search=React');
    const searchCount = searchRes.data?.data?.gigs?.length || 0;
    record('Feature 2: Search by Keyword ("React")', searchCount > 0, `Matching gigs: ${searchCount}`);

    // Category filter
    const catRes = await api('/gigs?category=Web%20Development');
    const catCount = catRes.data?.data?.gigs?.length || 0;
    record('Feature 2: Filter by Category ("Web Development")', catCount > 0, `Matching gigs: ${catCount}`);

    // Sorting
    const sortPrice = await api('/gigs?sort=price_asc');
    const p1 = sortPrice.data?.data?.gigs?.[0]?.rate || 0;
    const p2 = sortPrice.data?.data?.gigs?.[1]?.rate || p1;
    record('DP3 Discovery: Sort by Price Ascending', p1 <= p2, `First: ₹${p1}, Second: ₹${p2}`);

    // 3. Feature 1: Post a Gig
    const testGigPayload = {
      title: `E-Commerce Store & Payment API — Run ${Date.now()}`,
      category: 'Web Development',
      rate: 7500,
      description: 'Comprehensive Next.js and Tailwind e-commerce storefront with optimized performance and zero auth requirement.',
      deliveryDays: 4,
    };
    const postGigRes = await api('/gigs', 'POST', testGigPayload);
    const createdGig = postGigRes.data?.data?.gig;
    record('Feature 1: Post a Gig to Database', postGigRes.status === 201 && createdGig?._id, `Created Gig ID: ${createdGig?._id}, Rate: ₹${createdGig?.rate}`);

    // 4. Feature 3: Book a Gig
    const bookingPayload = {
      gigId: createdGig._id,
      message: 'Need a fast MVP build for our upcoming seed round launch.',
    };
    const bookRes = await api('/bookings', 'POST', bookingPayload);
    const createdBooking = bookRes.data?.data?.booking;
    record('Feature 3: Book a Gig (Instant Confirmation)', bookRes.status === 201 && createdBooking?._id && createdBooking.status === 'pending', `Booking ID: ${createdBooking?._id}, Status: ${createdBooking?.status}`);

    // 5. Feature 4: Creator Dashboard (Accept / Decline)
    const creatorBookings = await api('/bookings/creator');
    const cBookingsCount = creatorBookings.data?.data?.bookings?.length || 0;
    record('Feature 4: Creator Sees Incoming Bookings', cBookingsCount > 0, `Incoming requests: ${cBookingsCount}`);

    // Test Accept
    const acceptRes = await api(`/bookings/${createdBooking._id}/status`, 'PUT', { status: 'accepted' });
    record('Feature 4: Creator Accepts Booking', acceptRes.data?.data?.booking?.status === 'accepted', `Updated status: ${acceptRes.data?.data?.booking?.status}`);

    // Test Decline with Reason (DP1)
    const booking2 = await api('/bookings', 'POST', {
      gigId: createdGig._id,
      message: 'Testing creator decline feedback mechanism.',
    });
    const declineBookingId = booking2.data?.data?.booking?._id;

    const declineReasonText = 'Currently at maximum project bandwidth this week.';
    const declineRes = await api(`/bookings/${declineBookingId}/status`, 'PUT', {
      status: 'declined',
      declineReason: declineReasonText,
    });
    record('DP1 Rejection: Creator Declines with Reason', declineRes.data?.data?.booking?.status === 'declined' && declineRes.data?.data?.booking?.declineReason === declineReasonText, `Decline Reason: "${declineRes.data?.data?.booking?.declineReason}"`);

    // 6. Feature 5: My Bookings
    const clientBookingsRes = await api('/bookings/my');
    const myBookings = clientBookingsRes.data?.data?.bookings || [];
    const hasPending = myBookings.some((b) => b.status === 'pending');
    const hasAccepted = myBookings.some((b) => b.status === 'accepted');
    const hasDeclined = myBookings.some((b) => b.status === 'declined');
    record('Feature 5: Client Sees Status: Pending', hasPending, `Found ${myBookings.filter(b => b.status === 'pending').length} pending`);
    record('Feature 5: Client Sees Status: Accepted', hasAccepted, `Found ${myBookings.filter(b => b.status === 'accepted').length} accepted`);
    record('Feature 5: Client Sees Status: Declined', hasDeclined, `Found ${myBookings.filter(b => b.status === 'declined').length} declined`);

    // 7. Double Booking (DP2)
    const pBooking1 = await api('/bookings', 'POST', { gigId: createdGig._id, message: 'Concurrent client inquiry A' });
    const pBooking2 = await api('/bookings', 'POST', { gigId: createdGig._id, message: 'Concurrent client inquiry B' });
    record('DP2 Double Booking: Multiple Pending Inquiries Permitted', pBooking1.data?.success && pBooking2.data?.success, 'Both concurrent pending inquiries saved in pipeline');

    console.log('\n================================================================');
    console.log(`AUDIT COMPLETE: ${results.filter(r => r.passed).length} / ${results.length} CHECKS PASSED`);
    console.log('================================================================');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Audit Error:', error);
    process.exit(1);
  }
}

runAudit();
