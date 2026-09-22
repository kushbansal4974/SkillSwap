/**
 * TEMPORARY MOCK USERS
 * Used only for UI development and previewing authenticated states.
 * Will be replaced once backend auth endpoints are connected.
 */

export const mockCurrentUser = {
  id: "usr_101",
  name: "Arjun Mehta",
  email: "arjun@example.com",
  username: "arjunmehta",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  bio: "Full Stack Engineer & UI/UX Specialist with 5+ years of experience delivering scalable web applications and intuitive interfaces.",
  role: "seller",
  skills: ["React", "Node.js", "Tailwind CSS", "UI/UX Design", "REST APIs", "MongoDB"],
  rating: 4.95,
  reviewsCount: 48,
  location: "Bangalore, India",
  memberSince: "January 2023",
  responseTime: "1 hour"
};

export const mockUsers = [
  mockCurrentUser,
  {
    id: "usr_102",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    username: "priyadesigns",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    bio: "Senior Product Designer specializing in modern SaaS design systems and responsive mobile apps.",
    role: "seller",
    skills: ["Figma", "UI/UX Design", "Wireframing", "Design Systems"],
    rating: 4.98,
    reviewsCount: 86,
    location: "Mumbai, India",
    memberSince: "March 2022",
    responseTime: "2 hours"
  },
  {
    id: "usr_103",
    name: "Rohan Verma",
    email: "rohan@example.com",
    username: "rohan_code",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    bio: "Mobile App Developer creating high performance iOS & Android apps with React Native.",
    role: "seller",
    skills: ["React Native", "Flutter", "TypeScript", "Firebase"],
    rating: 4.88,
    reviewsCount: 34,
    location: "New Delhi, India",
    memberSince: "July 2023",
    responseTime: "30 minutes"
  },
  {
    id: "usr_104",
    name: "Ananya Iyer",
    email: "ananya@example.com",
    username: "ananya_writes",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    bio: "B2B Tech Content Strategist & Copywriter. Crafting SEO-optimized blogs, whitepapers, and landing page copy.",
    role: "seller",
    skills: ["Content Strategy", "SEO Copywriting", "Technical Writing", "Blogging"],
    rating: 4.92,
    reviewsCount: 62,
    location: "Chennai, India",
    memberSince: "November 2022",
    responseTime: "1 hour"
  }
];
