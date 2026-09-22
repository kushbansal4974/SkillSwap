import Gig from "../models/gig.model.js";

// =========================
// CREATE GIG
// =========================
export const createGig = async (req, res, next) => {
    try {
        const {
            title,
            category,
            description,
            shortDescription,
            rate,
            price,
            coverImage,
            image,
            deliveryDays,
            features,
        } = req.body;

        const effectiveRate = Number(rate !== undefined ? rate : price);

        // Required fields
        if (!title || !category || !description || Number.isNaN(effectiveRate)) {
            return res.status(400).json({
                success: false,
                message: "Title, category, description and a valid rate are required",
            });
        }

        if (!Number.isFinite(effectiveRate) || effectiveRate <= 0) {
            return res.status(400).json({
                success: false,
                message: "Rate must be a valid number greater than 0",
            });
        }

        const featuresArray = Array.isArray(features)
            ? features
            : (typeof features === "string" ? features.split("\n").map(f => f.trim()).filter(Boolean) : []);

        // Create gig
        const gig = await Gig.create({
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            shortDescription: shortDescription ? shortDescription.trim() : title.trim().slice(0, 100),
            rate: effectiveRate,
            coverImage: (coverImage || image || "").trim() || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
            deliveryDays: Number(deliveryDays) || 3,
            features: featuresArray.length > 0 ? featuresArray : ["High quality deliverables", "Revisions included"],
            creator: req.user.id,
            isActive: true,
        });

        await gig.populate("creator", "name email avatar bio");

        return res.status(201).json({
            success: true,
            message: "Gig created successfully",
            data: {
                gig,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =========================
// GET ALL GIGS (MARKETPLACE)
// =========================
export const getAllGigs = async (req, res, next) => {
    try {
        const {
            search,
            category,
            creator,
            minPrice,
            maxPrice,
            sort,
        } = req.query;

        const filter = {
            isActive: true,
        };

        // Category filter
        if (category && category !== "All") {
            filter.category = category.trim();
        }

        // Creator filter
        if (creator) {
            filter.creator = creator.trim();
        }

        // Price range
        if (minPrice || maxPrice) {
            filter.rate = {};
            if (minPrice) filter.rate.$gte = Number(minPrice);
            if (maxPrice) filter.rate.$lte = Number(maxPrice);
        }

        // Keyword Search
        if (search) {
            const searchTerm = search.trim();
            filter.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
                { category: { $regex: searchTerm, $options: "i" } },
            ];
        }

        // Sort configuration
        let sortOption = { createdAt: -1 };
        if (sort === "price_asc") sortOption = { rate: 1 };
        else if (sort === "price_desc") sortOption = { rate: -1 };
        else if (sort === "rating") sortOption = { rating: -1, createdAt: -1 };
        else if (sort === "newest") sortOption = { createdAt: -1 };

        const gigs = await Gig.find(filter)
            .populate("creator", "name email avatar bio")
            .sort(sortOption);

        return res.status(200).json({
            success: true,
            count: gigs.length,
            data: {
                gigs,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =========================
// GET SINGLE GIG
// =========================
export const getGigById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const gig = await Gig.findOne({
            _id: id,
            isActive: true,
        }).populate("creator", "name email avatar bio");

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found or is currently inactive",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                gig,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =========================
// GET CURRENT CREATOR GIGS
// =========================
export const getMyGigs = async (req, res, next) => {
    try {
        const gigs = await Gig.find({
            creator: req.user.id,
            isActive: true,
        })
            .populate("creator", "name email avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: gigs.length,
            data: {
                gigs,
            },
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// UPDATE GIG
// =========================
export const updateGig = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            category,
            description,
            shortDescription,
            rate,
            price,
            coverImage,
            image,
            deliveryDays,
            features,
        } = req.body;

        const gig = await Gig.findOne({
            _id: id,
            creator: req.user.id,
        });

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found or you are not authorized to edit it",
            });
        }

        if (title !== undefined) {
            const trimmedTitle = title.trim();
            if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Title must be between 3 and 100 characters",
                });
            }
            gig.title = trimmedTitle;
        }

        if (category !== undefined) {
            gig.category = category.trim();
        }

        if (description !== undefined) {
            const trimmedDesc = description.trim();
            if (trimmedDesc.length < 20 || trimmedDesc.length > 3000) {
                return res.status(400).json({
                    success: false,
                    message: "Description must be between 20 and 3000 characters",
                });
            }
            gig.description = trimmedDesc;
        }

        if (shortDescription !== undefined) {
            gig.shortDescription = shortDescription.trim();
        }

        const effectiveRate = Number(rate !== undefined ? rate : price);
        if (!Number.isNaN(effectiveRate) && effectiveRate > 0) {
            gig.rate = effectiveRate;
        }

        if (coverImage || image) {
            gig.coverImage = (coverImage || image).trim();
        }

        if (deliveryDays !== undefined) {
            gig.deliveryDays = Math.max(1, Number(deliveryDays) || 3);
        }

        if (features !== undefined) {
            gig.features = Array.isArray(features)
                ? features
                : (typeof features === "string" ? features.split("\n").map(f => f.trim()).filter(Boolean) : gig.features);
        }

        await gig.save();
        await gig.populate("creator", "name email avatar bio");

        return res.status(200).json({
            success: true,
            message: "Gig updated successfully",
            data: {
                gig,
            },
        });

    } catch (error) {
        next(error);
    }
};

// =========================
// DELETE GIG (SOFT DELETE)
// =========================
export const deleteGig = async (req, res, next) => {
    try {
        const { id } = req.params;

        const gig = await Gig.findOne({
            _id: id,
            creator: req.user.id,
        });

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found or you are not authorized to delete it",
            });
        }

        gig.isActive = false;
        await gig.save();

        return res.status(200).json({
            success: true,
            message: "Gig deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};