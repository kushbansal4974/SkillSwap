import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";
import Gig from "./models/gig.model.js";
import Booking from "./models/booking.model.js";

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // Clean existing records (optional: clean only seed collections)
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Booking.deleteMany({});
    console.log("Cleared existing users, gigs, and bookings.");

    const hashedPassword = await bcrypt.hash("password123", 12);

    // 1. Create Demo Users
    const creatorUser1 = await User.create({
      name: "Aman Sharma",
      email: "creator@skillswap.com",
      password: hashedPassword,
      role: "creator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      bio: "Full Stack Engineer & Cloud Architect with 6+ years building scalable SaaS applications with React, Node.js, and TypeScript.",
      skills: ["React", "Node.js", "Next.js", "MongoDB", "Tailwind CSS", "AWS"],
      location: "Bangalore, India",
    });

    const creatorUser2 = await User.create({
      name: "Ananya Iyer",
      email: "designer@skillswap.com",
      password: hashedPassword,
      role: "creator",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      bio: "Lead UI/UX Designer & Design Systems Advocate. Specializing in conversion-focused interfaces and interactive Figma prototypes.",
      skills: ["Figma", "UI/UX Design", "Wireframing", "Design Systems", "Prototyping"],
      location: "Mumbai, India",
    });

    const creatorUser3 = await User.create({
      name: "Vikram Malhotra",
      email: "editor@skillswap.com",
      password: hashedPassword,
      role: "creator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      bio: "Professional Video Editor & Motion Graphics Designer. Producing viral shorts, reels, and YouTube long-form content.",
      skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Color Grading", "Sound Design"],
      location: "Delhi, India",
    });

    const clientUser = await User.create({
      name: "Rohan Varma",
      email: "client@skillswap.com",
      password: hashedPassword,
      role: "client",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      bio: "Tech entrepreneur, angel investor, and product manager hiring top creators for modern web & mobile products.",
      skills: ["Product Strategy", "Project Management", "Agile Execution"],
      location: "Hyderabad, India",
    });

    console.log("Seeded 4 users (3 Creators, 1 Client).");

    // 2. Create Marketplace Gigs
    const gigsData = [
      {
        title: "Full-Stack Web App & SaaS MVP with React, Node.js & MongoDB",
        category: "Web Development",
        rate: 8500,
        deliveryDays: 5,
        shortDescription: "End-to-end production web application with clean architecture, authentication, and responsive design.",
        description: "I will design, build, and deploy a robust full-stack web application tailored for your business or startup. Includes JWT auth, REST APIs, MongoDB integration, clean Tailwind styling, and deployment to cloud platforms.",
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        features: [
          "Responsive React & Tailwind Frontend",
          "Secure Express & MongoDB Backend",
          "JWT Auth & Role-Based Access Control",
          "Production deployment guidance",
          "3 Revisions included",
        ],
        rating: 4.9,
        reviewsCount: 38,
        creator: creatorUser1._id,
      },
      {
        title: "High-Converting Modern Landing Page with Framer Motion Animations",
        category: "Web Development",
        rate: 4500,
        deliveryDays: 3,
        shortDescription: "Stunning, high-converting responsive landing page built with modern micro-animations.",
        description: "Transform your visitors into loyal customers with an ultra-fast, visually captivating landing page. Features fluid framer-motion animations, dark/light themes, SEO optimization, and mobile-first responsiveness.",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        features: [
          "Ultra-fast loading speed",
          "Smooth scroll & reveal animations",
          "Dark and light mode support",
          "Fully responsive on all mobile devices",
          "Contact form integration",
        ],
        rating: 5.0,
        reviewsCount: 52,
        creator: creatorUser1._id,
      },
      {
        title: "Complete Mobile & Web App UI/UX Design in Figma with Design System",
        category: "UI/UX Design",
        rate: 6000,
        deliveryDays: 4,
        shortDescription: "Pixel-perfect modern product design with complete style guide, components, and clickable prototype.",
        description: "Get industry-standard Figma designs that developers love. I provide comprehensive UX wireframes, modern high-fidelity screens, interactive prototypes, and an atomic design system with typography, colors, and components.",
        coverImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
        features: [
          "Interactive clickable prototype in Figma",
          "Atomic design system with reusable components",
          "Desktop, Tablet, and Mobile artboards",
          "Export-ready developer assets",
          "Unlimited revisions during design sprint",
        ],
        rating: 4.9,
        reviewsCount: 44,
        creator: creatorUser2._id,
      },
      {
        title: "Minimalist Brand Identity, Vector Logo & Complete Brand Guidelines",
        category: "Graphic Design",
        rate: 3500,
        deliveryDays: 2,
        shortDescription: "Memorable modern brand identity package, vector logos, color palettes, and social media kit.",
        description: "Stand out in your market with a clean, timeless visual identity. Deliverables include primary, secondary, and mark logos in all vector formats (SVG, EPS, AI), color palette codes, typography pairings, and brand manual.",
        coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
        features: [
          "Vector master files (AI, SVG, PDF, PNG)",
          "Brand typography & color palette guide",
          "Social media kit for LinkedIn, X & Instagram",
          "Commercial usage rights included",
        ],
        rating: 4.8,
        reviewsCount: 29,
        creator: creatorUser2._id,
      },
      {
        title: "Viral Short-Form Video Editing for Instagram Reels, TikTok & Shorts",
        category: "Video Editing",
        rate: 2500,
        deliveryDays: 2,
        shortDescription: "Hook-driven short-form video editing with dynamic captions, sound design, and b-roll pacing.",
        description: "Maximize retention and engagement with expert short-form video editing. I craft compelling hooks, synchronized kinetic subtitles, dynamic zoom-cuts, cinematic color grading, and trend-focused sound design.",
        coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
        features: [
          "Dynamic kinetic captions & emojis",
          "Sound effects, transitions & music mix",
          "Curated stock footage & b-roll insertion",
          "Optimized for 9:16 vertical ratio",
          "Fast 48-hour delivery",
        ],
        rating: 5.0,
        reviewsCount: 67,
        creator: creatorUser3._id,
      },
      {
        title: "Cinematic YouTube Video Editing & Audio Mastering",
        category: "Video Editing",
        rate: 5500,
        deliveryDays: 4,
        shortDescription: "Story-driven long-form editing for educational, tech, and narrative YouTube channels.",
        description: "Professional multi-cam editing, audio noise reduction and leveling, lower thirds, chapter markers, motion titles, and narrative pacing that keeps watch time high.",
        coverImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80",
        features: [
          "Up to 20 minutes footage editing",
          "Pro audio mix & mastering",
          "Motion titles & animated chapter markers",
          "Full 4K export",
        ],
        rating: 4.9,
        reviewsCount: 31,
        creator: creatorUser3._id,
      },
      {
        title: "SEO-Optimized Tech & Business Articles that Rank on Google",
        category: "Content Writing",
        rate: 2000,
        deliveryDays: 2,
        shortDescription: "Thoroughly researched, high-authority blog posts and technical documentation.",
        description: "High-quality, engaging content that combines deep industry research with semantic keyword optimization. Perfect for technical blogs, SaaS thought leadership, and company newsletters.",
        coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
        features: [
          "1500+ words in-depth article",
          "Targeted keyword placement & meta description",
          "100% human-written, plagiarism-free guarantee",
          "Includes relevant royalty-free imagery",
        ],
        rating: 4.8,
        reviewsCount: 22,
        creator: creatorUser1._id,
      },
      {
        title: "Cross-Platform Mobile App with React Native & Expo",
        category: "Mobile Development",
        rate: 12000,
        deliveryDays: 7,
        shortDescription: "Smooth iOS & Android mobile application with native performance and clean UI.",
        description: "Build once and deploy to both iOS App Store and Google Play. Complete with push notifications, offline caching, API synchronization, smooth navigation, and dark mode support.",
        coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
        features: [
          "iOS & Android universal build with Expo",
          "Clean modular architecture",
          "Push notifications & deep linking",
          "App Store submission support",
        ],
        rating: 5.0,
        reviewsCount: 19,
        creator: creatorUser1._id,
      },
    ];

    const seededGigs = await Gig.insertMany(gigsData);
    console.log(`Seeded ${seededGigs.length} high-quality marketplace gigs.`);

    // 3. Create Sample Bookings for Client & Creator (Pending, Accepted, Declined)
    await Booking.create([
      {
        gig: seededGigs[0]._id,
        client: clientUser._id,
        creator: creatorUser1._id,
        agreedRate: seededGigs[0].rate,
        message: "Need a modern SaaS MVP for an AI creator tool with clean architecture.",
        status: "accepted",
      },
      {
        gig: seededGigs[2]._id,
        client: clientUser._id,
        creator: creatorUser2._id,
        agreedRate: seededGigs[2].rate,
        message: "Looking for a clean mobile design system for our iOS fintech application.",
        status: "pending",
      },
      {
        gig: seededGigs[4]._id,
        client: clientUser._id,
        creator: creatorUser3._id,
        agreedRate: seededGigs[4].rate,
        message: "Editing 5 reel clips for an upcoming product launch campaign.",
        status: "declined",
        declineReason: "Currently at maximum project bandwidth for this sprint.",
      },
    ]);

    console.log("Seeded 3 sample bookings covering all brief statuses (Pending, Accepted, Declined).");
    console.log("=========================================");
    console.log("Database successfully seeded!");
    console.log("Demo Credentials:");
    console.log("Creator: creator@skillswap.com | password123");
    console.log("Designer: designer@skillswap.com | password123");
    console.log("Client: client@skillswap.com | password123");
    console.log("=========================================");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
