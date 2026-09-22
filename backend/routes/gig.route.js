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
router.get("/my", getMyGigs);

// Get single gig by id
router.get("/:id", getGigById);

// =========================
// GIG MANAGEMENT ROUTES
// =========================

// Create gig (Feature 1: Post a Gig)
router.post("/", createGig);

// Update gig
router.put("/:id", updateGig);

// Delete gig
router.delete("/:id", deleteGig);

export default router;