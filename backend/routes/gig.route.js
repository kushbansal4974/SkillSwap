import express from "express";

import {
    createGig,
    getAllGigs,
    getGigById,
    getMyGigs,
    updateGig,
    deleteGig,
} from "../controllers/gig.controller.js";

import {
    protect,
    authorize,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================

// Browse all marketplace gigs
router.get("/", getAllGigs);

// Creator's own gigs (MUST be declared before /:id)
router.get(
    "/my",
    protect,
    authorize("creator"),
    getMyGigs
);

// Get single gig by id
router.get("/:id", getGigById);

// =========================
// CREATOR PROTECTED ROUTES
// =========================

// Create gig
router.post(
    "/",
    protect,
    authorize("creator"),
    createGig
);

// Update own gig
router.put(
    "/:id",
    protect,
    authorize("creator"),
    updateGig
);

// Delete own gig
router.delete(
    "/:id",
    protect,
    authorize("creator"),
    deleteGig
);

export default router;