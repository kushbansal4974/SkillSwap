# Backend Integration Guide — SkillsSwap Frontend

This document is prepared specifically for the backend developer to connect their Express + MongoDB server to this React + Vite frontend smoothly.

> [!NOTE]
> The frontend was intentionally architected with a decoupled API layer. **Components never contain hardcoded API URLs or backend paths.** All endpoints, data transformations, and headers are centralized in the `src/api/` directory.

---

## 1. Where API Base URL is Configured

The frontend uses an environment variable for the backend base URL.

- **File**: [`.env`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/.env) and [`.env.example`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/.env.example)
- **Configuration Key**:
  ```env
  VITE_API_URL=http://localhost:5000
  VITE_USE_MOCK=false
  ```
- **How it's read**: In [`src/api/client.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/client.js), Axios is initialized with:
  ```javascript
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
  ```

---

## 2. Where Authentication Endpoints are Configured

- **File**: [`src/api/authApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/authApi.js)
- **Endpoint Configuration Object**:
  ```javascript
  export const AUTH_ENDPOINTS = {
    login: '/AUTH_LOGIN_ENDPOINT',        // TODO — VERIFY WITH BACKEND (e.g. '/api/auth/login')
    register: '/AUTH_REGISTER_ENDPOINT',  // TODO — VERIFY WITH BACKEND (e.g. '/api/auth/register')
    logout: '/AUTH_LOGOUT_ENDPOINT',      // TODO — VERIFY WITH BACKEND (e.g. '/api/auth/logout')
    me: '/AUTH_ME_ENDPOINT',              // TODO — VERIFY WITH BACKEND (e.g. '/api/auth/me')
  };
  ```

### Expected Auth Request Payloads

#### `login(credentials)`
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

#### `register(userData)`
```json
{
  "name": "Arjun Mehta",
  "email": "user@example.com",
  "password": "userpassword"
}
```

### Expected Auth Response Structures
The frontend handles either direct objects or `{ data: ... }` wrappers:
```json
{
  "token": "jwt_token_string_here",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "Arjun Mehta",
    "email": "user@example.com",
    "username": "arjunmehta",
    "avatar": "https://example.com/avatar.jpg",
    "role": "seller",
    "bio": "Full stack engineer...",
    "skills": ["React", "Node.js"]
  }
}
```

---

## 3. Where Gig Endpoints are Configured

- **File**: [`src/api/gigApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/gigApi.js)
- **Endpoint Configuration Object**:
  ```javascript
  export const GIG_ENDPOINTS = {
    getGigs: '/GIGS_ENDPOINT',                  // TODO — VERIFY WITH BACKEND (e.g. '/api/gigs')
    getGigById: (id) => `/GIGS_ENDPOINT/${id}`, // TODO — VERIFY WITH BACKEND (e.g. `/api/gigs/${id}`)
    createGig: '/GIGS_ENDPOINT',                // TODO — VERIFY WITH BACKEND (e.g. '/api/gigs')
    updateGig: (id) => `/GIGS_ENDPOINT/${id}`, // TODO — VERIFY WITH BACKEND (e.g. `/api/gigs/${id}`)
    deleteGig: (id) => `/GIGS_ENDPOINT/${id}`, // TODO — VERIFY WITH BACKEND (e.g. `/api/gigs/${id}`)
    getMyGigs: '/MY_GIGS_ENDPOINT',             // TODO — VERIFY WITH BACKEND (e.g. '/api/gigs/my-gigs')
  };
  ```

### Query Parameters for `getGigs`
When searching and filtering on the Explore page, the frontend passes these optional query parameters:
- `search`: Keyword string (matches title, description, or tags)
- `category`: Category string (e.g., `'Web Development'`, `'UI/UX Design'`)
- `minPrice`: Number (e.g. `1000`)
- `maxPrice`: Number (e.g. `50000`)
- `sort`: Sort mode (`'rating'`, `'price_asc'`, `'price_desc'`, `'newest'`)

### Expected Gig Request Payload (Create & Update)
```json
{
  "title": "Build a Modern Full-Stack Web Application with React & Node.js",
  "category": "Web Development",
  "price": 12500,
  "deliveryDays": 5,
  "shortDescription": "Custom responsive web applications...",
  "description": "Full details on what the gig includes...",
  "coverImage": "https://images.unsplash.com/...",
  "features": [
    "Responsive layouts",
    "RESTful API integration",
    "3 Revisions included"
  ]
}
```

### Expected Gig Model / Response
```json
{
  "id": "gig_mongo_id",
  "title": "...",
  "category": "...",
  "price": 12500,
  "deliveryDays": 5,
  "description": "...",
  "coverImage": "...",
  "features": ["..."],
  "rating": 4.9,
  "reviewsCount": 12,
  "sellerId": "user_id_here",
  "seller": {
    "id": "user_id_here",
    "name": "Arjun Mehta",
    "username": "arjunmehta",
    "avatar": "...",
    "responseTime": "1 hour"
  },
  "createdAt": "2024-03-01T12:00:00Z"
}
```

---

## 4. Where Booking Endpoints are Configured

- **File**: [`src/api/bookingApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/bookingApi.js)
- **Endpoint Configuration Object**:
  ```javascript
  export const BOOKING_ENDPOINTS = {
    createBooking: '/BOOKINGS_ENDPOINT',                      // TODO — VERIFY WITH BACKEND (e.g. '/api/bookings')
    getMyBookings: '/MY_BOOKINGS_ENDPOINT',                  // TODO — VERIFY WITH BACKEND (e.g. '/api/bookings/my')
    getBookingById: (id) => `/BOOKINGS_ENDPOINT/${id}`,      // TODO — VERIFY WITH BACKEND (e.g. `/api/bookings/${id}`)
    cancelBooking: (id) => `/BOOKINGS_ENDPOINT/${id}/cancel`,// TODO — VERIFY WITH BACKEND (e.g. `/api/bookings/${id}/cancel`)
  };
  ```

### Expected Booking Creation Request Payload
```json
{
  "gigId": "gig_mongo_id",
  "price": 12500,
  "requirementsNote": "We need a 5-screen onboarding flow and home dashboard for our B2B SaaS tool."
}
```

### Expected Booking Model / Response
```json
{
  "id": "booking_mongo_id",
  "gigId": "gig_mongo_id",
  "gig": {
    "id": "gig_mongo_id",
    "title": "Build a Modern Full-Stack Web Application",
    "coverImage": "https://...",
    "category": "Web Development"
  },
  "buyer": {
    "id": "buyer_user_id",
    "name": "Buyer Name",
    "email": "buyer@example.com"
  },
  "seller": {
    "id": "seller_user_id",
    "name": "Seller Name",
    "avatar": "https://...",
    "username": "selleruser"
  },
  "price": 12500,
  "status": "Pending",
  "deliveryDate": "2024-04-10",
  "requirementsNote": "...",
  "createdAt": "2024-04-01T10:30:00Z"
}
```
Supported status strings: `'Pending'`, `'Confirmed'`, `'Completed'`, `'Cancelled'`.

---

## 5. JWT / Cookie Handling Connection

The client is prepared to support either authentication architecture:

### Option A: Bearer Token in Authorization Header (Default Active)
- Stored in `localStorage` under key `'token'`.
- Automatically attached by the Axios request interceptor in [`src/api/client.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/client.js):
  ```javascript
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```

### Option B: HTTP-Only Cookies
- In [`src/api/client.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/client.js), `withCredentials: true` is enabled by default.
- If using cookies, the backend server must configure `credentials: true` and specify the exact origin.

---

## 6. CORS Configuration for Backend Developer

In your Express `server.js`, configure CORS to accept requests from the Vite development server origin:

```javascript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Vite default dev server
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Required for cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 7. How to Switch from Mock Data to Real Backend

1. Open [`.env`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/.env) and set:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_USE_MOCK=false
   ```
2. In [`src/api/authApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/authApi.js), update `AUTH_ENDPOINTS` with your Express routes.
3. In [`src/api/gigApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/gigApi.js), update `GIG_ENDPOINTS` with your Express routes.
4. In [`src/api/bookingApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/bookingApi.js), update `BOOKING_ENDPOINTS` with your Express routes.
5. Once verified, the folder [`src/data/`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/data) (`mockGigs.js`, `mockUsers.js`, `mockBookings.js`) can be deleted.

---

## 8. Summary of Files to Modify for Integration

| File Path | Purpose | What to Change |
| :--- | :--- | :--- |
| [`.env`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/.env) | Environment Config | Set `VITE_API_URL` and `VITE_USE_MOCK=false` |
| [`src/api/authApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/authApi.js) | Auth Endpoints | Replace placeholder values in `AUTH_ENDPOINTS` |
| [`src/api/gigApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/gigApi.js) | Gig Endpoints | Replace placeholder values in `GIG_ENDPOINTS` |
| [`src/api/bookingApi.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/bookingApi.js) | Booking Endpoints | Replace placeholder values in `BOOKING_ENDPOINTS` |
| [`src/api/client.js`](file:///d:/Hackathon%20Azisly_AI/Frontend_SkillsSwap/src/api/client.js) | Axios Setup | Toggle `withCredentials` if using HTTP cookies vs token |
