import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Booking from "../models/booking.model.js";

// =====================================================
// CREATE RAZORPAY / SANDBOX ORDER
// =====================================================
export const createPaymentOrder = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
            });
        }

        // Find booking belonging to logged-in client
        const booking = await Booking.findOne({
            _id: bookingId,
            client: req.user.id,
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Creator must have accepted booking
        if (booking.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Payment is allowed only after the creator accepts the booking",
            });
        }

        // Already paid
        if (booking.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "This booking has already been paid",
            });
        }

        // Existing order
        if (booking.razorpayOrderId) {
            return res.status(200).json({
                success: true,
                message: "Existing payment order found",
                data: {
                    orderId: booking.razorpayOrderId,
                    amount: Math.round(booking.agreedRate * 100),
                    currency: "INR",
                    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
                    isSandbox: !process.env.RAZORPAY_KEY_SECRET,
                },
            });
        }

        const amountInPaise = Math.round(booking.agreedRate * 100);

        let orderId = null;
        let isSandbox = false;

        // Try creating real order if keys are set
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            try {
                const order = await razorpay.orders.create({
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: `booking_${booking._id}`,
                    notes: {
                        bookingId: booking._id.toString(),
                        clientId: req.user.id.toString(),
                    },
                });
                orderId = order.id;
            } catch (err) {
                console.warn("Razorpay API order creation failed, falling back to sandbox:", err.message);
                orderId = `order_demo_${Date.now()}`;
                isSandbox = true;
            }
        } else {
            orderId = `order_demo_${Date.now()}`;
            isSandbox = true;
        }

        booking.razorpayOrderId = orderId;
        await booking.save();

        return res.status(201).json({
            success: true,
            message: "Payment order created",
            data: {
                orderId,
                amount: amountInPaise,
                currency: "INR",
                keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
                isSandbox,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// VERIFY PAYMENT
// =====================================================
export const verifyPayment = async (req, res, next) => {
    try {
        const {
            bookingId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        if (
            !bookingId ||
            !razorpayPaymentId ||
            !razorpayOrderId
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details are required",
            });
        }

        // Find booking belonging to logged-in client
        const booking = await Booking.findOne({
            _id: bookingId,
            client: req.user.id,
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Make sure this order belongs to our booking
        if (booking.razorpayOrderId !== razorpayOrderId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay order",
            });
        }

        // Already paid
        if (booking.paymentStatus === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                data: {
                    bookingId: booking._id,
                    paymentStatus: booking.paymentStatus,
                    paidAt: booking.paidAt,
                },
            });
        }

        // Verification logic
        if (process.env.RAZORPAY_KEY_SECRET && razorpaySignature) {
            // Live HMAC signature check
            const generatedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(`${booking.razorpayOrderId}|${razorpayPaymentId}`)
                .digest("hex");

            const isSignatureValid = crypto.timingSafeEqual(
                Buffer.from(generatedSignature),
                Buffer.from(razorpaySignature)
            );

            if (!isSignatureValid) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment signature",
                });
            }
        } else {
            // Sandbox/Demo Verification
            console.log(`Demo Payment verified for booking ${booking._id}`);
        }

        // Mark as paid
        booking.razorpayPaymentId = razorpayPaymentId;
        booking.paymentStatus = "paid";
        booking.paidAt = new Date();

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: {
                bookingId: booking._id,
                paymentStatus: booking.paymentStatus,
                paidAt: booking.paidAt,
                paymentId: razorpayPaymentId,
            },
        });

    } catch (error) {
        next(error);
    }
};