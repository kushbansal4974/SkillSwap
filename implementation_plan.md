# Implementation Plan - MERN Gig Marketplace Frontend

Build a modern, professional, responsive React + Vite + Tailwind CSS frontend for a Freelancer / Gig Marketplace (similar in quality and feel to Upwork, Contra, and modern creator platforms, avoiding any AI-themed gimmicks or neon aesthetics). The frontend strictly adheres to a decoupled architecture with a centralized API layer, mock data abstraction, and a comprehensive backend integration guide for teammate handoff.

## User Review Required

> [!IMPORTANT]
> - **Zero Backend Code**: No Express, MongoDB, or server files will be created or altered.
> - **No Hardcoded Endpoints**: All API routes and base URLs are isolated in `src/api/` with clearly documented placeholder endpoints (`TODO — VERIFY WITH BACKEND`).
> - **Dual Mode Architecture**: The API layer will use a configurable flag (`VITE_USE_MOCK=true` by default until backend endpoints are ready) so that all pages, forms, filters, bookings, and auth states can be fully interacted with immediately in development without throwing network errors. When the backend is ready, flipping `VITE_USE_MOCK=false` and adding the real routes connects the real backend seamlessly.

## Proposed Architecture & Structure

```
Frontend_SkillsSwap/
├── .env
├── .env.example
├── BACKEND_INTEGRATION.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── api/
    │   ├── client.js           # Axios instance, baseURL from env, interceptors for Bearer token & cookies
    │   ├── authApi.js          # Centralized auth endpoints (login, register, logout, getCurrentUser)
    │   ├── gigApi.js           # Centralized gig endpoints (getGigs, getGigById, createGig, updateGig, deleteGig, getMyGigs)
    │   └── bookingApi.js       # Centralized booking endpoints (createBooking, getMyBookings, getBookingById, cancelBooking)
    ├── assets/
    ├── components/
    │   ├── Navbar.jsx          # Responsive desktop & mobile navigation with auth-aware links
    │   ├── Footer.jsx          # Clean professional footer with marketplace links
    │   ├── GigCard.jsx         # Card displaying gig image, seller, title, category, price, rating
    │   ├── SearchBar.jsx       # Reusable search input with category trigger
    │   ├── CategoryCard.jsx    # Clean icon + title category card with hover effects
    │   ├── BookingModal.jsx    # Modal for selecting service tier/dates and booking a gig
    │   ├── Loading.jsx         # Reusable spinner & skeleton loaders for cards/tables
    │   ├── EmptyState.jsx      # Clean empty state display for no gigs, no bookings, etc.
    │   └── ProtectedRoute.jsx  # Route guard redirecting unauthenticated users to /login
    ├── context/
    │   └── AuthContext.jsx     # User state, token management, login/register/logout methods
    ├── data/
    │   ├── mockGigs.js         # Realistic initial gig data for UI preview
    │   ├── mockUsers.js        # Sample users & sellers
    │   └── mockBookings.js     # Sample bookings with statuses
    ├── layouts/
    │   └── MainLayout.jsx      # Navbar + Outlet + Footer wrapper
    ├── pages/
    │   ├── Home.jsx            # Hero, Search, Categories, Featured Gigs, Value Proposition
    │   ├── Explore.jsx         # Search, Category filters, Price filter, Sort dropdown, Gig grid
    │   ├── GigDetails.jsx      # Detailed gig view, seller info, Book Now modal trigger, Edit/Delete if owner
    │   ├── Login.jsx           # Clean login form with validation & redirect
    │   ├── Register.jsx        # Registration form (Name, Email, Password, Confirm Password)
    │   ├── CreateGig.jsx       # Professional gig creation form with validation & preview
    │   ├── EditGig.jsx         # Form preloaded with existing gig data for editing
    │   ├── MyGigs.jsx          # Dashboard listing user's created gigs with View/Edit/Delete
    │   ├── Bookings.jsx        # Dashboard for client/freelancer bookings with status badges
    │   ├── Profile.jsx         # User profile page with details, avatar, stats, bio
    │   └── NotFound.jsx        # Clean 404 page with navigation back home
    ├── App.jsx                 # React Router routing configuration
    ├── main.jsx                # Application root with AuthProvider & BrowserRouter
    └── index.css               # Tailwind directives, custom font imports, clean utility tokens
```

---

## Proposed Changes

### 1. Project Initialization & Dependencies
- Initialize Vite React project in current directory `d:\Hackathon Azisly_AI\Frontend_SkillsSwap`.
- Install dependencies:
  - `react-router-dom`
  - `axios`
  - `lucide-react`
  - `tailwindcss`, `postcss`, `autoprefixer`
- Configure `tailwind.config.js` with modern neutral color palette:
  - Background: `#FAFAFA`, Surface: `#FFFFFF`, Dark Text: `#111827`, Secondary Text: `#6B7280`, Border: `#E5E7EB`, Primary Accent: `#2563EB` (Royal Blue) / `#1D4ED8`.
  - Clean font pairing (Inter font family).

### 2. Centralized API Layer & Mock Data Layer
- [NEW] `src/api/client.js`:
  - Axios client configured with `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'`.
  - Request interceptor checking client-stored JWT token (`Authorization: Bearer <token>`).
  - Configurable flag for `withCredentials: true` (for HTTP-only cookies support).
  - Response error interceptor for uniform error handling.
- [NEW] `src/api/authApi.js`:
  - `AUTH_ENDPOINTS` object containing placeholders `login: '/AUTH_LOGIN_ENDPOINT'`, `register: '/AUTH_REGISTER_ENDPOINT'`, `logout: '/AUTH_LOGOUT_ENDPOINT'`, `me: '/AUTH_ME_ENDPOINT'`.
  - Supports mock fallback when `VITE_USE_MOCK=true` or backend is unreachable.
- [NEW] `src/api/gigApi.js`:
  - `GIG_ENDPOINTS` object with placeholders for `getGigs`, `getGigById`, `createGig`, `updateGig`, `deleteGig`, `getMyGigs`.
  - Query parameter support for search, category, price range, and sorting.
- [NEW] `src/api/bookingApi.js`:
  - `BOOKING_ENDPOINTS` object with placeholders for `createBooking`, `getMyBookings`, `getBookingById`, `cancelBooking`.
- [NEW] `src/data/mockGigs.js`, `mockUsers.js`, `mockBookings.js`:
  - Professional mock datasets representing real-world gigs across Web Dev, UI/UX, Graphic Design, Content Writing, Mobile Dev, etc., with Indian Rupee (₹) pricing and realistic descriptions.

### 3. Authentication & Context
- [NEW] `src/context/AuthContext.jsx`:
  - Manages `user`, `isAuthenticated`, `loading`, `login(credentials)`, `register(userData)`, `logout()`.
  - Uses `authApi` methods.

### 4. Reusable UI Components
- [NEW] `src/components/Navbar.jsx`:
  - Desktop: Logo, Explore, Categories, How It Works, Search, Become a Seller / Login / Register (or My Gigs / Bookings / Profile / Logout).
  - Mobile: Clean slide-out / dropdown menu with full navigation.
- [NEW] `src/components/Footer.jsx`:
  - Clean footer with categorized links, copyright, marketplace disclaimers.
- [NEW] `src/components/GigCard.jsx`:
  - Thumbnail, seller avatar, seller name, rating & reviews, gig title, short description, category badge, "Starting at ₹XXX", "View Gig" action.
- [NEW] `src/components/CategoryCard.jsx`:
  - Lucide icons for Web Dev, UI/UX Design, Graphic Design, Content Writing, Video Editing, Marketing, Mobile Development, Photography.
- [NEW] `src/components/SearchBar.jsx`:
  - Clean search bar with icon, instant submit, query state synchronization.
- [NEW] `src/components/BookingModal.jsx`:
  - Modal with booking summary, note/requirement input, delivery timeframe, price summary, and confirm booking trigger.
- [NEW] `src/components/Loading.jsx`:
  - Clean spinners and animated skeleton cards/tables.
- [NEW] `src/components/EmptyState.jsx`:
  - Polished empty state with Lucide icons, message, and call-to-action button.
- [NEW] `src/components/ProtectedRoute.jsx`:
  - Protects private routes (`/create-gig`, `/edit-gig/:id`, `/my-gigs`, `/bookings`, `/profile`), redirecting unauthenticated users to `/login`.

### 5. Application Pages
- [NEW] `src/pages/Home.jsx`:
  - Hero with specific copy: *"Your next project starts here."*, *"Find skilled people for work that matters."*, *"Discover talented creators, developers, designers and professionals ready to help bring your ideas to life."*
  - Large search bar, "Explore Gigs" and "Start Selling" CTAs.
  - Popular Categories grid with Lucide icons.
  - Featured Gigs grid with filtering previews.
  - Trust & Quality section (verified talent, secure transactions, clear milestones).
- [NEW] `src/pages/Explore.jsx`:
  - Search query handling.
  - Category filter pills/sidebar.
  - Price range slider/inputs (Min / Max).
  - Sorting (Highest rated, Price low to high, Price high to low, Newest).
  - Dynamic responsive gig grid with loading and empty states.
- [NEW] `src/pages/GigDetails.jsx`:
  - Gig images, title, seller profile badge & bio, full description, scope/deliverables, pricing card with Book Now trigger.
  - Owner action buttons (Edit Gig, Delete Gig with confirmation modal).
- [NEW] `src/pages/Login.jsx` & `Register.jsx`:
  - Modern, accessible forms with client-side validation and clear error feedback.
- [NEW] `src/pages/CreateGig.jsx` & `EditGig.jsx`:
  - Fields: Title, Category, Price, Delivery Time, Description, Cover Image URL / File placeholder.
  - Form validation, loading state, error display, cancel and submit actions.
- [NEW] `src/pages/MyGigs.jsx`:
  - Seller dashboard showing created gigs, view count, price, actions (View, Edit, Delete).
  - Confirmation modal for delete actions.
- [NEW] `src/pages/Bookings.jsx`:
  - Tabs for "All Bookings", "Active", "Completed", "Cancelled".
  - Clean table / cards showing Gig info, Client/Seller, Amount, Date, Status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`), and Action buttons (Cancel Booking, View Gig).
- [NEW] `src/pages/Profile.jsx`:
  - User details (avatar, name, email, username, member since, bio, skills, active listings).
- [NEW] `src/pages/NotFound.jsx`:
  - 404 error page with quick links back to Home and Explore.

### 6. Integration Documentation & Environment
- [NEW] `BACKEND_INTEGRATION.md`:
  - Complete, structured documentation specifying:
    1. Base URL config (`.env`)
    2. Auth endpoints configuration
    3. Gig endpoints configuration
    4. Booking endpoints configuration
    5. Expected request payloads (JSON)
    6. Expected response schemas
    7. JWT / Cookie configuration options
    8. Mock removal instructions
    9. CORS setup instructions for Express teammate
    10. Checklist of exact file locations to modify
- [NEW] `.env` and `.env.example`:
  - `VITE_API_URL=http://localhost:5000`
  - `VITE_USE_MOCK=true`

---

## Verification Plan

### Automated / Build Verification
- Run `npm run build` to verify there are no JSX syntax errors, unresolved imports, or Vite bundling failures.
- Run `npx tailwindcss -i ./src/index.css -o ./dist/output.css --dry-run` or Vite dev check.

### Visual & Interactive Browser Verification
- Start the Vite development server using `run_command` (`npm run dev`).
- Launch `browser_subagent` to test the live application:
  - **Desktop View (1440px)**:
    - Verify Home page hero, search bar, category cards, and featured gig cards.
    - Navigate to `/explore`, test searching and category filter clicks.
    - Click a gig card to navigate to `/gigs/:id`, check gig details and open the Booking modal.
    - Navigate to `/login` and `/register`, test form validation.
    - Test logging in (using mock auth), verify Navbar updates to show user menu (My Gigs, Bookings, Profile, Logout).
    - Navigate to `/create-gig`, test form validation.
    - Navigate to `/my-gigs`, test delete modal.
    - Navigate to `/bookings`, test status badges and filtering.
    - Navigate to `/profile`, test profile presentation.
  - **Mobile View (375px)**:
    - Verify Navbar collapses into mobile menu with toggle.
    - Verify responsive grid layouts adapt cleanly without horizontal overflow.
