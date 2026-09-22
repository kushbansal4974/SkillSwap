import express from "express";

import {
    createPaymentOrder,
    verifyPayment,
} from "../controllers/payment.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();


// Create Razorpay order
router.post(
    "/create-order",
    protect,
    authorize("client"),
    createPaymentOrder
);


// Verify Razorpay payment
router.post(
    "/verify",
    protect,
    authorize("client"),
    verifyPayment
);


export default router;