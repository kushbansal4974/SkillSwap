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


// =====================================================
// CLIENT
// =====================================================

// Create booking
router.post(
    "/",
    protect,
    createBooking
);

// Generic bookings list (auto-routes based on role or query)
router.get(
    "/",
    protect,
    (req, res, next) => {
        if (req.query.role === "creator" || req.query.type === "creator" || req.user?.role === "creator") {
            return getCreatorBookings(req, res, next);
        }
        return getMyBookings(req, res, next);
    }
);

// Client's bookings
router.get(
    "/my",
    protect,
    getMyBookings
);

// Creator's incoming bookings
router.get(
    "/creator",
    protect,
    getCreatorBookings
);

// Single booking
router.get(
    "/:id",
    protect,
    getBookingById
);

// Accept / decline booking (Standard PUT and PATCH routes)
router.put(
    "/:id/status",
    protect,
    updateBookingStatus
);

router.patch(
    "/:id/status",
    protect,
    updateBookingStatus
);

router.put(
    "/:id",
    protect,
    updateBookingStatus
);

router.patch(
    "/:id",
    protect,
    updateBookingStatus
);


export default router;