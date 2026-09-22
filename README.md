# SkillSwap — Creator Economy Gig Marketplace

**Hackathon Team / ID**: `Haridwar Team 22`  
**Team Member**: `Lakshya Kumar`   `Kush Bansal`
**Track**: `Track 2 · Real-World AI Products (Creator Economy — SkillSwap)`  
**Standard API Implemented**: **YES** (Fully implements standard REST endpoints for automated test script grading & browser agents)  

---

## 🌟 Executive Summary

**SkillSwap** is a full-stack, production-ready creator economy marketplace where emerging creators monetize their digital services and clients book them seamlessly. Built strictly according to the **Code2Career Track 2: Real-World AI Products** brief with high visual craft, responsive dark and light modes, robust concurrency control, and zero-barrier evaluator access.

---

## 🏆 Hackathon Brief Compliance Checklist

### 1. The 5 Required Features

| # | Feature | Web Route | API Endpoint(s) | Status | Brief Description |
|---|---|---|---|---|---|
| **1** | **Post a Gig** | `/create-gig` | `POST /api/gigs`<br>`POST /api/v1/gigs` | ✅ **DONE** | A creator lists a service with title, category, rate, and description. |
| **2** | **Browse & Search** | `/explore` | `GET /api/gigs`<br>`GET /api/v1/gigs` | ✅ **DONE** | A marketplace page listing all gigs, searchable and filterable by category. |
| **3** | **Book a Gig** | `/gigs/:id` | `POST /api/bookings`<br>`POST /api/v1/bookings` | ✅ **DONE** | A client books via a form and sees an instant confirmation. |
| **4** | **Creator Dashboard** | `/creator-dashboard` | `GET /api/bookings/creator`<br>`PUT /api/bookings/:id/status` | ✅ **DONE** | A creator sees incoming bookings and accepts or declines them (with feedback). |
| **5** | **My Bookings** | `/bookings` | `GET /api/bookings/my`<br>`GET /api/bookings` | ✅ **DONE** | A client sees their bookings with status: **Pending**, **Accepted**, or **Declined**. |

---

### 2. The 3 Architectural Decision Points (20 pts)

See the dedicated [`DECISIONS.md`](./DECISIONS.md) file at root for full 2–4 sentence technical rationales.

- **DP1 · Rejection**:
  - *Decision*: When a creator declines, the booking remains visible in the client's "My Bookings" tagged as `Declined` with the creator's decline reason, accompanied by 1-click alternative creator suggestions in the same category.
  - *Why*: Eliminates client disorientation and mistrust, respects creator capacity limits, and prevents client bounce by immediately recommending ready alternative creators.
- **DP2 · Double Booking**:
  - *Decision*: Multiple `Pending` bookings are permitted concurrently, but strict atomic capacity checks at the moment of **Acceptance** prevent overbooking.
  - *Why*: Prevents unconfirmed or idle inquiries from freezing a creator's marketplace availability while ensuring creators never overcommit beyond their delivery schedule.
- **DP3 · Discovery & Ranking**:
  - *Decision*: Default ranking utilizes **Dynamic Multi-Factor Rotation with Emerging Creator Boost (Newest Verified First)**, with client controls to sort by Newest, Price (Asc/Desc), and Rating.
  - *Why*: Solves the cold-start problem, prevents legacy freelancer monopolies, and gives new creators organic impressions without race-to-the-bottom pricing.

---

### 3. Zero-Barrier Grader Accessibility (Hackathon Requirement)

> [!IMPORTANT]
> **No Authentication Required**: In accordance with the hackathon submission guideline (*"Do not implement authentication (login/signup) in your project: graders must be able to access all features without creating an account"*), every single feature (`/explore`, `/create-gig`, `/creator-dashboard`, `/bookings`) is **instantly accessible to graders and automated evaluation scripts without creating an account or signing in**.
> 
> A 1-click **Perspective Switcher** is embedded in the navigation bar to immediately toggle between **Client** and **Creator** perspectives.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS (Tailored Obsidian/Slate Dark & Light Modes), Lucide Icons, Framer Motion, Axios.
- **Backend**: Node.js, Express 5, MongoDB with Mongoose ODM.
- **Architecture**: Clean MVC architecture with dual `/api/*` and `/api/v1/*` endpoint support.

---

## 🚀 Step-by-Step Run Instructions

### Prerequisites
- Node.js $\ge$ 18.x
- MongoDB (local `mongodb://127.0.0.1:27017/skillswap` or MongoDB Atlas URI in `backend/.env`)

### Option A: Quick Launch from Root

```bash
# 1. Install root, backend, and frontend dependencies
npm run install:all # Or manually cd backend && npm install, cd frontend && npm install

# 2. Seed realistic demo data (Gigs across categories & Bookings in Pending/Accepted/Declined states)
npm run seed

# 3. Start Backend server (:5000)
npm run start:backend

# 4. In a separate terminal, start Frontend dev server (:5173)
npm run start:frontend
```

### Option B: Running Services Individually

```bash
# Backend
cd backend
npm install
node seed.js
node server.js
# -> Running on http://localhost:5000 (Health check: http://localhost:5000/api/health)

# Frontend
cd ../frontend
npm install
npm run dev
# -> Running on http://localhost:5173
```

---

## 📡 Standard REST API Reference

The backend mounts both `/api/*` and `/api/v1/*` prefixes without authentication barriers:

```
# Healthcheck
GET    /api/health                   # System health & uptime

# Gigs (Feature 1 & Feature 2)
GET    /api/gigs                     # List gigs (query: search, category, minPrice, maxPrice, sort)
GET    /api/gigs/my                  # Gigs by creator
GET    /api/gigs/:id                 # Get single gig details
POST   /api/gigs                     # Create new gig (title, category, rate, description)
PUT    /api/gigs/:id                 # Update existing gig
DELETE /api/gigs/:id                 # Delete gig

# Bookings (Feature 3, Feature 4 & Feature 5)
GET    /api/bookings                 # List bookings
GET    /api/bookings/my              # Client bookings (Pending, Accepted, Declined)
GET    /api/bookings/creator         # Creator incoming bookings
GET    /api/bookings/:id             # Single booking details
POST   /api/bookings                 # Book a gig (gigId, message)
PUT    /api/bookings/:id/status      # Accept or decline booking (status, declineReason)
PATCH  /api/bookings/:id/status      # Status update alias
PUT    /api/bookings/:id             # Standard REST update alias
PATCH  /api/bookings/:id             # Standard REST patch alias
```

---

## 📦 Deployment Guidance

### Deploying Frontend to Vercel / Netlify
1. Set root directory to `frontend/`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`.

### Deploying Backend to Render / Railway
1. Set root directory to `backend/`.
2. Build command: `npm install`.
3. Start command: `node server.js`.
4. Add environment variables: `MONGO_URI`, `PORT=5000`, `NODE_ENV=production`.

---

*Code2Career Track 2: Real-World AI Products · SkillSwap Submission · Haridwar Team 22*
