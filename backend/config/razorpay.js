import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder";

const razorpay = new Razorpay({
    key_id,
    key_secret,
});

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    console.log("💳 Razorpay configured with live/test API keys.");
} else {
    console.log("ℹ️  Razorpay API keys not found in .env; sandbox demo mode will be enabled for payments.");
}

export default razorpay;