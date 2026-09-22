import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Gig is required"],
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client is required"],
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },

    // Price at the time of booking
    agreedRate: {
      type: Number,
      required: [true, "Agreed rate is required"],
      min: [1, "Agreed rate must be greater than 0"],
    },

    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "declined"],
        message: "Invalid booking status",
      },
      default: "pending",
    },
    declineReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Useful indexes for performance
bookingSchema.index({ client: 1, createdAt: -1 });
bookingSchema.index({ creator: 1, status: 1 });
bookingSchema.index({ gig: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);


export default Booking;
