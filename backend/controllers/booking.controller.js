import Booking from "../models/booking.model.js";
import Gig from "../models/gig.model.js";

// =====================================================
// CREATE BOOKING
// =====================================================
export const createBooking = async (req, res, next) => {
    try {
        const { gigId, message } = req.body;

        if (!gigId) {
            return res.status(400).json({
                success: false,
                message: "Gig ID is required",
            });
        }

        // Find active gig
        const gig = await Gig.findOne({
            _id: gigId,
            isActive: true,
        });

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found or no longer available",
            });
        }

        // Client cannot book own gig
        if (gig.creator.toString() === req.user.id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot book your own gig",
            });
        }

        // Check existing pending booking
        const existingBooking = await Booking.findOne({
            gig: gig._id,
            client: req.user.id,
            status: "pending",
        });

        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending booking for this gig",
            });
        }

        // Validate message
        const bookingMessage = message ? message.trim() : "";
        if (bookingMessage.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 1000 characters",
            });
        }

        // Create booking
        const booking = await Booking.create({
            gig: gig._id,
            client: req.user.id,
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
// GET MY BOOKINGS - CLIENT
// =====================================================
export const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            client: req.user.id,
        })
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
// GET CREATOR BOOKINGS
// =====================================================
export const getCreatorBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            creator: req.user.id,
        })
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

        const isClient = booking.client._id.toString() === req.user.id.toString();
        const isCreator = booking.creator._id.toString() === req.user.id.toString();

        if (!isClient && !isCreator) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this booking",
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
// UPDATE BOOKING STATUS
// =====================================================
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, reason, declineReason } = req.body;

        // Only accepted / declined are allowed
        if (!["accepted", "declined"].includes(status)) {
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

        // Only the creator can accept/decline
        if (booking.creator.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the gig creator can update booking status",
            });
        }

        // Booking must currently be pending
        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Booking is already ${booking.status}`,
            });
        }

        booking.status = status;
        if (status === "declined") {
            booking.declineReason = (reason || declineReason || "").trim();
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
            message: `Booking ${status} successfully`,
            data: {
                booking,
            },
        });

    } catch (error) {
        next(error);
    }
};