/**
 * TEMPORARY MOCK GIGS
 * Used only for UI development and previewing marketplace listings.
 * Components do NOT import this directly; they call gigApi functions.
 * Replace with real backend API calls when backend is connected.
 */

import { mockCurrentUser, mockUsers } from './mockUsers';

export const mockGigs = [
  {
    id: "gig_1",
    title: "Build a Modern Full-Stack Web Application with React & Node.js",
    description: "I will design and develop a responsive, high-performance web application tailored to your business needs. Includes responsive layouts, REST API integration, database architecture, authentication, and clean modular code following industry best practices.",
    shortDescription: "Custom responsive full-stack web applications built with modern React and clean backend APIs.",
    category: "Web Development",
    price: 12500,
    deliveryDays: 5,
    revisions: 3,
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.96,
    reviewsCount: 42,
    sellerId: mockCurrentUser.id, // Owned by current user for testing edit/delete
    seller: {
      id: mockCurrentUser.id,
      name: mockCurrentUser.name,
      username: mockCurrentUser.username,
      avatar: mockCurrentUser.avatar,
      rating: mockCurrentUser.rating,
      reviewsCount: mockCurrentUser.reviewsCount,
      responseTime: mockCurrentUser.responseTime
    },
    features: [
      "Responsive on all screen sizes (Mobile, Tablet, Desktop)",
      "Clean, maintainable React component architecture",
      "RESTful API integration with robust error handling",
      "Database schema and secure authentication setup",
      "Production-ready deployment support"
    ],
    createdAt: "2024-02-10T10:00:00Z"
  },
  {
    id: "gig_2",
    title: "Design Intuitive UI/UX for Web & Mobile Apps in Figma",
    description: "Get modern, conversion-focused user interfaces and frictionless user experiences for your digital products. Includes user journey mapping, high-fidelity wireframes, interactive prototypes, and a complete design system with reusable components.",
    shortDescription: "High-fidelity Figma UI/UX designs, wireframes, and complete component design systems.",
    category: "UI/UX Design",
    price: 8500,
    deliveryDays: 4,
    revisions: 5,
    coverImage: "https://images.unsplash.com/photo-1581291518655-9523c932deda?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1581291518655-9523c932deda?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.98,
    reviewsCount: 86,
    sellerId: "usr_102",
    seller: {
      id: "usr_102",
      name: "Priya Sharma",
      username: "priyadesigns",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      rating: 4.98,
      reviewsCount: 86,
      responseTime: "2 hours"
    },
    features: [
      "Pixel-perfect Figma source files",
      "Design tokens and reusable component library",
      "Interactive clickable prototypes",
      "Mobile and desktop responsive variants",
      "Developer handoff documentation"
    ],
    createdAt: "2024-02-15T14:30:00Z"
  },
  {
    id: "gig_3",
    title: "Cross-Platform Mobile App Development with React Native",
    description: "Launch smooth, native-feeling mobile apps on both iOS and Android from a single robust codebase. I handle state management, native device features (camera, location, notifications), offline caching, and backend API integration.",
    shortDescription: "Smooth iOS & Android mobile applications built with React Native and seamless API integration.",
    category: "Mobile Development",
    price: 18000,
    deliveryDays: 7,
    revisions: 4,
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.88,
    reviewsCount: 34,
    sellerId: "usr_103",
    seller: {
      id: "usr_103",
      name: "Rohan Verma",
      username: "rohan_code",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.88,
      reviewsCount: 34,
      responseTime: "30 minutes"
    },
    features: [
      "iOS and Android compatibility",
      "Fast native performance & 60fps animations",
      "Push notifications & deep linking setup",
      "App store release guidance and build configuration"
    ],
    createdAt: "2024-02-18T09:15:00Z"
  },
  {
    id: "gig_4",
    title: "SEO-Optimized Tech Blog Posts & B2B SaaS Articles",
    description: "Engage your target audience and rank on Google with thoroughly researched, authoritative content written specifically for developers, tech founders, and enterprise buyers. Includes keyword research, meta descriptions, and compelling headlines.",
    shortDescription: "Engaging, authoritative B2B SaaS articles and SEO-optimized technical blog posts.",
    category: "Content Writing",
    price: 3500,
    deliveryDays: 2,
    revisions: 2,
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.92,
    reviewsCount: 62,
    sellerId: "usr_104",
    seller: {
      id: "usr_104",
      name: "Ananya Iyer",
      username: "ananya_writes",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      rating: 4.92,
      reviewsCount: 62,
      responseTime: "1 hour"
    },
    features: [
      "1,500 words of deeply researched content",
      "Semantic keyword optimization (SurferSEO / Clearscope ready)",
      "Zero plagiarism & original technical insights",
      "Custom royalty-free diagrams or header mockups"
    ],
    createdAt: "2024-02-20T11:45:00Z"
  },
  {
    id: "gig_5",
    title: "Minimalist Brand Identity, Logo & Social Media Kit",
    description: "Establish a memorable, timeless brand with custom vector logos, balanced typography hierarchy, color palette specifications, and brand guideline documentation ready for print and web.",
    shortDescription: "Timeless minimalist logo design, color guidelines, and complete vector brand kit.",
    category: "Graphic Design",
    price: 6000,
    deliveryDays: 3,
    revisions: 3,
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.91,
    reviewsCount: 29,
    sellerId: "usr_102",
    seller: {
      id: "usr_102",
      name: "Priya Sharma",
      username: "priyadesigns",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      rating: 4.98,
      reviewsCount: 86,
      responseTime: "2 hours"
    },
    features: [
      "3 unique initial concept sketches",
      "Vector source files (AI, SVG, EPS, PDF)",
      "Brand style guide & color swatch codes",
      "Social media avatars & banner templates"
    ],
    createdAt: "2024-02-22T16:00:00Z"
  },
  {
    id: "gig_6",
    title: "Professional Product Video Editing & Short-Form Reels",
    description: "Turn raw footage into snappy, high-retention video content for YouTube, Instagram Reels, and TikTok. Includes sound design, color grading, motion graphics, and subtitles.",
    shortDescription: "Snappy video editing with sound design, dynamic cuts, and retention-focused pacing.",
    category: "Video Editing",
    price: 4500,
    deliveryDays: 2,
    revisions: 2,
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.87,
    reviewsCount: 19,
    sellerId: "usr_103",
    seller: {
      id: "usr_103",
      name: "Rohan Verma",
      username: "rohan_code",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.88,
      reviewsCount: 34,
      responseTime: "30 minutes"
    },
    features: [
      "Full HD / 4K export formats",
      "Dynamic captions & animated sound effects",
      "Royalty-free background music licensing",
      "Quick turnaround within 48 hours"
    ],
    createdAt: "2024-02-25T13:20:00Z"
  },
  {
    id: "gig_7",
    title: "B2B SaaS Growth Marketing & Paid Ads Campaign Setup",
    description: "Scale your customer acquisition through targeted Google Search Ads, LinkedIn campaigns, and conversion rate optimization (CRO) audits tailored for tech products.",
    shortDescription: "Targeted Google & LinkedIn ads setup with landing page conversion optimization.",
    category: "Marketing",
    price: 15000,
    deliveryDays: 5,
    revisions: 2,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.94,
    reviewsCount: 23,
    sellerId: "usr_104",
    seller: {
      id: "usr_104",
      name: "Ananya Iyer",
      username: "ananya_writes",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      rating: 4.92,
      reviewsCount: 62,
      responseTime: "1 hour"
    },
    features: [
      "Competitor advertising analysis",
      "High-intent keyword grouping and negative keyword lists",
      "Ad copy drafting and A/B test variations",
      "Conversion tracking tag setup (Google Tag Manager)"
    ],
    createdAt: "2024-03-01T08:30:00Z"
  },
  {
    id: "gig_8",
    title: "Commercial Product & Architectural Photography",
    description: "Professional high-resolution product photography and commercial imagery for e-commerce, websites, and promotional campaigns. Clean studio lighting and expert color grading.",
    shortDescription: "High-resolution commercial photography, studio lighting, and color retouching.",
    category: "Photography",
    price: 9500,
    deliveryDays: 3,
    revisions: 2,
    coverImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.89,
    reviewsCount: 15,
    sellerId: mockCurrentUser.id, // Second gig owned by current user
    seller: {
      id: mockCurrentUser.id,
      name: mockCurrentUser.name,
      username: mockCurrentUser.username,
      avatar: mockCurrentUser.avatar,
      rating: mockCurrentUser.rating,
      reviewsCount: mockCurrentUser.reviewsCount,
      responseTime: mockCurrentUser.responseTime
    },
    features: [
      "25 edited high-resolution digital images",
      "Commercial usage rights included",
      "White background & lifestyle settings",
      "Color accuracy calibrated for print and digital"
    ],
    createdAt: "2024-03-05T12:00:00Z"
  }
];
