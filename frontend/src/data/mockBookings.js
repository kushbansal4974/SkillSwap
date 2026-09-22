/**
 * TEMPORARY MOCK BOOKINGS
 * Used only for UI development and previewing the Bookings page.
 * Components do NOT import this directly; they call bookingApi functions.
 */

import { mockCurrentUser } from './mockUsers';
import { mockGigs } from './mockGigs';

export const mockBookings = [
  {
    id: "bkg_001",
    gigId: "gig_2",
    gig: {
      id: "gig_2",
      title: "Design Intuitive UI/UX for Web & Mobile Apps in Figma",
      coverImage: "https://images.unsplash.com/photo-1581291518655-9523c932deda?w=800&auto=format&fit=crop&q=80",
      category: "UI/UX Design",
    },
    buyer: {
      id: mockCurrentUser.id,
      name: mockCurrentUser.name,
      email: mockCurrentUser.email,
    },
    seller: {
      id: "usr_102",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      username: "priyadesigns",
    },
    price: 8500,
    deliveryDate: "2024-04-10",
    createdAt: "2024-04-01T10:30:00Z",
    status: "Confirmed", // Statuses: 'Pending', 'Confirmed', 'Completed', 'Cancelled'
    requirementsNote: "We need a 5-screen onboarding flow and home dashboard for our B2B SaaS tool."
  },
  {
    id: "bkg_002",
    gigId: "gig_4",
    gig: {
      id: "gig_4",
      title: "SEO-Optimized Tech Blog Posts & B2B SaaS Articles",
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
      category: "Content Writing",
    },
    buyer: {
      id: mockCurrentUser.id,
      name: mockCurrentUser.name,
      email: mockCurrentUser.email,
    },
    seller: {
      id: "usr_104",
      name: "Ananya Iyer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      username: "ananya_writes",
    },
    price: 3500,
    deliveryDate: "2024-03-25",
    createdAt: "2024-03-20T14:15:00Z",
    status: "Completed",
    requirementsNote: "Article covering 'Building Scalable Microservices with Node.js and Docker'."
  },
  {
    id: "bkg_003",
    gigId: "gig_1",
    gig: {
      id: "gig_1",
      title: "Build a Modern Full-Stack Web Application with React & Node.js",
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
      category: "Web Development",
    },
    buyer: {
      id: "usr_103",
      name: "Rohan Verma",
      email: "rohan@example.com",
    },
    seller: {
      id: mockCurrentUser.id,
      name: mockCurrentUser.name,
      avatar: mockCurrentUser.avatar,
      username: mockCurrentUser.username,
    },
    price: 12500,
    deliveryDate: "2024-04-18",
    createdAt: "2024-04-05T08:00:00Z",
    status: "Pending",
    requirementsNote: "Need customer portal with authentication, billing summary, and Stripe webhook integration."
  },
  {
    id: "bkg_004",
    gigId: "gig_6",
    gig: {
      id: "gig_6",
      title: "Professional Product Video Editing & Short-Form Reels",
      coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
      category: "Video Editing",
    },
    buyer: {
      id: mockCurrentUser.id,
      name: mockCurrentUser.name,
      email: mockCurrentUser.email,
    },
    seller: {
      id: "usr_103",
      name: "Rohan Verma",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      username: "rohan_code",
    },
    price: 4500,
    deliveryDate: "2024-03-12",
    createdAt: "2024-03-10T16:00:00Z",
    status: "Cancelled",
    requirementsNote: "Cancelled due to raw video file corrupted during upload."
  }
];
