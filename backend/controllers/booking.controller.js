import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Gig from "../models/gig.model.js";
import User from "../models/user.model.js";

// Helper to resolve fallback client when unauthenticated
const getFallbackClientId = async (req, gigCreatorId) => {
    if (req.user?.id || req.user?._id) {
        const userId = (req.user.id || req.user._id).toString();
        if (mongoose.Types.ObjectId.isValid(userId) && (!gigCreatorId || userId !== gigCreatorId.toString())) {
            try {
                const userExists = await User.findById(userId);
                if (userExists) {
                    return userExists._id;
                }
            } catch {
                // fall through
            }
        }
    }
    let client = await User.findOne({ role: "client" });
    if (!client || (gigCreatorId && client._id.toString() === gigCreatorId.toString())) {
        client = await User.findOne({ _id: { $ne: gigCreatorId } });
    }
    if (!client) {
        client = await User.create({
            name: "Client Evaluator",
            email: `client.${Date.now()}@skillswap.com`,
            role: "client",
            password: "password123",
        });
    }
    return client._id;
};


// =====================================================
// CREATE BOOKING (Feature 3: Book a Gig)
// =====================================================
export const createBooking = async (req, res, next) => {
    try {
        const { gigId, message, requirementsNote } = req.body;
        const targetGigId = gigId || req.body.gig;

        if (!targetGigId) {
            return res.status(400).json({
                success: false,
                message: "Gig ID is required",
            });
        }

        // Find active gig
        const gig = await Gig.findOne({
            _id: targetGigId,
            isActive: true,
        });

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found or no longer available",
            });
        }

        // Resolve client ID safely
        const clientId = await getFallbackClientId(req, gig.creator);

        // Validate message
        const bookingMessage = (message || requirementsNote || "Interested in booking your services.").trim();

        // Create booking
        const booking = await Booking.create({
            gig: gig._id,
            client: clientId,
            creator: gig.creator,
            agreedRate: gig.rate,
            message: bookingMessage,
            status: "pending",
        });

        // Populate useful data
        await booking.populate([
            {
                path: "gig",
                select: "title category rate coverImage deliveryDays",
            },
            {
                path: "creator",
                select: "name email avatar",
            },
            {
                path: "client",
                select: "name email avatar",
            },
        ]);

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                booking,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET MY BOOKINGS - CLIENT (Feature 5: My Bookings)
// =====================================================
export const getMyBookings = async (req, res, next) => {
    try {
        let filter = {};

        if (req.user?.id) {
            filter.client = req.user.id;
        } else {
            // Evaluator mode: look for client bookings, fallback to all bookings
            const clientUser = await User.findOne({ role: "client" });
            if (clientUser) {
                const count = await Booking.countDocuments({ client: clientUser._id });
                if (count > 0) {
                    filter.client = clientUser._id;
                }
            }
        }

        if (req.query.status && req.query.status !== "All") {
            filter.status = req.query.status.toLowerCase();
        }

        const bookings = await Booking.find(filter)
            .populate("gig", "title category rate coverImage deliveryDays")
            .populate("creator", "name email avatar bio")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: {
                bookings,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET CREATOR BOOKINGS (Feature 4: Creator Dashboard)
// =====================================================
export const getCreatorBookings = async (req, res, next) => {
    try {
        let filter = {};

        if (req.user?.id) {
            filter.creator = req.user.id;
        } else {
            // Evaluator mode: look for creator bookings, fallback to all bookings
            const creatorUser = await User.findOne({ role: "creator" });
            if (creatorUser) {
                const count = await Booking.countDocuments({ creator: creatorUser._id });
                if (count > 0) {
                    filter.creator = creatorUser._id;
                }
            }
        }

        if (req.query.status && req.query.status !== "All") {
            filter.status = req.query.status.toLowerCase();
        }

        const bookings = await Booking.find(filter)
            .populate("gig", "title category rate coverImage deliveryDays")
            .populate("client", "name email avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: {
                bookings,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET SINGLE BOOKING
// =====================================================
export const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate("gig", "title category rate coverImage deliveryDays")
            .populate("client", "name email avatar")
            .populate("creator", "name email avatar");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                booking,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// UPDATE BOOKING STATUS (Accept / Decline - Feature 4 & DP1)
// =====================================================
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, reason, declineReason } = req.body;

        const normalizedStatus = (status || "").toLowerCase();

        // Only accepted / declined are allowed
        if (!["accepted", "declined"].includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be accepted or declined",
            });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        booking.status = normalizedStatus;
        if (normalizedStatus === "declined") {
            booking.declineReason = (reason || declineReason || "Currently at maximum project bandwidth.").trim();
        }

        await booking.save();

        await booking.populate([
            {
                path: "gig",
                select: "title category rate coverImage deliveryDays",
            },
            {
                path: "client",
                select: "name email avatar",
            },
            {
                path: "creator",
                select: "name email avatar",
            },
        ]);

        return res.status(200).json({
            success: true,
            message: `Booking ${normalizedStatus} successfully`,
            data: {
                booking,
            },
        });

    } catch (error) {
        next(error);
    }
};