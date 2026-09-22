import mongoose from "mongoose";

const GIG_CATEGORIES = [
    "Web Development",
    "UI/UX Design",
    "Graphic Design",
    "Video Editing",
    "Photography",
    "Content Writing",
    "Social Media",
    "Marketing",
    "Mobile Development",
    "Music",
    "Other",
];

const gigSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Gig title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [100, "Title cannot exceed 100 characters"],
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            enum: {
                values: GIG_CATEGORIES,
                message: "Invalid gig category",
            },
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [20, "Description must be at least 20 characters"],
            maxlength: [3000, "Description cannot exceed 3000 characters"],
        },

        shortDescription: {
            type: String,
            trim: true,
            default: "",
            maxlength: [200, "Short description cannot exceed 200 characters"],
        },

        rate: {
            type: Number,
            required: [true, "Rate is required"],
            min: [1, "Rate must be greater than 0"],
            max: [10000000, "Rate cannot exceed 10000000"],
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator is required"],
        },

        coverImage: {
            type: String,
            default: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        },

        deliveryDays: {
            type: Number,
            default: 3,
            min: [1, "Delivery must be at least 1 day"],
            max: [90, "Delivery cannot exceed 90 days"],
        },

        features: {
            type: [String],
            default: ["High quality deliverables", "Fast turnaround", "Revisions included"],
        },

        rating: {
            type: Number,
            default: 5.0,
            min: [1, "Rating cannot be lower than 1"],
            max: [5, "Rating cannot be higher than 5"],
        },

        reviewsCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

gigSchema.index({ creator: 1 });
gigSchema.index({ category: 1 });
gigSchema.index({ createdAt: -1 });
gigSchema.index({ title: "text", description: "text" });

const Gig = mongoose.model("Gig", gigSchema);

export { GIG_CATEGORIES };
export default Gig;