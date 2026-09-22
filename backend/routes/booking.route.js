import express from "express";

import {
    createBooking,
    getMyBookings,
    getCreatorBookings,
    getBookingById,
    updateBookingStatus,
} from "../controllers/booking.controller.js";

import {
    protect,
    authorize,
} from "../middlewares/auth.middleware.js";

const router = express.Router();


// Create booking (Feature 3: Book a Gig)
router.post("/", createBooking);

// Generic bookings list (auto-routes based on role or query)
router.get("/", (req, res, next) => {
    if (req.query.role === "creator" || req.query.type === "creator" || req.user?.role === "creator") {
        return getCreatorBookings(req, res, next);
    }
    return getMyBookings(req, res, next);
});

// Client's bookings (Feature 5: My Bookings)
router.get("/my", getMyBookings);

// Creator's incoming bookings (Feature 4: Creator Dashboard)
router.get("/creator", getCreatorBookings);

// Single booking
router.get("/:id", getBookingById);

// Accept / decline booking (Feature 4: Creator Dashboard actions)
router.put("/:id/status", updateBookingStatus);
router.patch("/:id/status", updateBookingStatus);
router.put("/:id", updateBookingStatus);
router.patch("/:id", updateBookingStatus);

export default router;