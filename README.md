# CineRate – Movie Information & Rating Portal

CineRate is a modern, responsive, full-stack web application designed for cinematic exploration, film rating, community reviews, and personal watchlist curation. It offers moviegoers and cinema enthusiasts an immersive, authentic platform to discover films across various genres, languages, and decades.

---

## Key Features

- **Movie Discovery & Catalog**: Explore a rich catalog of films with detailed storylines, directors, ensemble cast, runtimes, release years, and high-definition posters and backdrops.
- **Dynamic Multi-Facet Filtering**: Filter movies in real time by genre, language, release year, and minimum rating (e.g., 4.5+ stars), and sort by popularity, rating, release date, or alphabetically without page reloads.
- **Instant Search**: Debounced search supporting partial title matching, director search, cast lookups, and keywords with live autocomplete preview.
- **1–5 Star Rating System**: Interactive rating widget allowing authenticated users to score films, update existing scores, and instantly view average calculations and total review tallies.
- **Community Review System**: Authenticated users can write in-depth reviews, edit their personal reviews, and delete them.
- **Personal Watchlist**: One-click bookmarking of films to a private user watchlist with quick-removal and live navigation counters.
- **User Authentication**: Secure registration and login using bcrypt password hashing, JWT session management, and HTTP-only session cookies.
- **User Profile**: Dedicated hub displaying user credentials, account join date, total movies rated, reviews written, and direct management of ratings and watchlists.
- **Administrator Dashboard**: Role-based access control (RBAC) allowing administrators to add new movies, edit catalog entries, delete films, moderate reviews, and monitor registered users.
- **Responsive Cinematic UI**: Styled with Tailwind CSS, dark glassmorphism, responsive navigation drawers, and trailer modal previews.

---

## Technology Stack

### Frontend
- **React 19** with **TypeScript**
- **Tailwind CSS v4** for clean responsive styling and glassmorphism
- **Lucide React** for modern iconography
- **Motion** for smooth state transitions

### Backend
- **Node.js & Express** API architecture with modular routers
- **Vite** middleware integration for development and static compilation in production
- **Bcrypt.js** for strong salted password hashing
- **JSON Web Tokens (JWT)** with HTTP-only cookies (`SameSite=Lax` / `SameSite=Strict`)

### Database
- **PostgreSQL** relational database
- Compatible with **Supabase PostgreSQL**, **Neon**, **AWS RDS**, or **Google Cloud SQL**
- Resilient embedded data layer that supports local fallback during initial setup

---

## Application Architecture

```
cinerate/
├── database/
│   └── schema.sql             # Complete PostgreSQL DDL, constraints, indexes & seeds
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AuthModal.tsx      # Sign in / Register modal with 1-click demo logins
│   │   ├── DeleteConfirmModal.tsx # Safe deletion confirmations
│   │   ├── MovieCard.tsx      # Cinematic movie card with watchlist & trailer actions
│   │   ├── MovieFormModal.tsx # Admin Add/Edit movie modal form
│   │   ├── Navbar.tsx         # Responsive navigation & live search dropdown
│   │   ├── RatingStars.tsx    # Interactive 1-5 star widget
│   │   └── TrailerModal.tsx   # Video trailer modal player
│   ├── context/
│   │   ├── AuthContext.tsx    # Global user session & state
│   │   └── ToastContext.tsx   # Real-time alert notifications
│   ├── lib/
│   │   └── api.ts             # Typed HTTP client for all API endpoints
│   ├── server/                # Backend API & Database Layer
│   │   ├── auth.ts            # JWT verification & HTTP-only cookies
│   │   ├── db.ts              # PostgreSQL pool & database operations
│   │   └── routes.ts          # RESTful API route controllers
│   ├── views/                 # Top-level page views
│   │   ├── AdminPage.tsx      # Admin metrics, movie CRUD, review moderation
│   │   ├── GenresPage.tsx     # Visual genre category explorer
│   │   ├── HomePage.tsx       # Hero showcase, popular, top rated, recent rows
│   │   ├── MovieDetailsPage.tsx # Film details, star ratings, reviews
│   │   ├── MoviesPage.tsx     # Discovery catalog & multi-facet filters
│   │   ├── ProfilePage.tsx    # User stats, watchlist, personal reviews
│   │   └── WatchlistPage.tsx  # Dedicated saved films grid
│   ├── App.tsx                # Main view router & layout wrapper
│   ├── index.css              # Global Tailwind imports & custom scrollbars
│   └── main.tsx               # Client entry point
├── server.ts                  # Express server entry point mounting API & Vite
├── vercel.json                # Vercel deployment configuration & API rewrites
├── package.json
└── README.md
```

---

## Database Structure

The PostgreSQL schema enforces strict relational integrity with foreign keys and unique constraints:

```sql
users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    genre VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL DEFAULT 'English',
    duration VARCHAR(50) NOT NULL,
    director VARCHAR(150) NOT NULL,
    cast_members TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    trailer_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_rating UNIQUE (user_id, movie_id)
);

reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_watchlist UNIQUE (user_id, movie_id)
);
```

---

## API Overview

### Authentication
- `POST /api/auth/register` – Register a new user account with hashed password and receive session cookie.
- `POST /api/auth/login` – Validate credentials and issue HTTP-only cookie.
- `POST /api/auth/logout` – Clear HTTP-only session cookie.
- `GET /api/auth/me` – Retrieve current authenticated user profile and stats.
- `PUT /api/auth/profile` – Update user display name or email.

### Movies
- `GET /api/movies` – Query catalog with filters: `search`, `genre`, `language`, `year`, `minRating`, `sort`, `limit`, `offset`.
- `GET /api/movies/:id` – Fetch movie specifications, aggregated average rating, and reviews.
- `GET /api/movies/search?q=` – Rapid title, cast, director, and genre search.
- `POST /api/movies` – Admin only: create a new movie entry.
- `PUT /api/movies/:id` – Admin only: update an existing movie.
- `DELETE /api/movies/:id` – Admin only: delete a movie entry and cascade associated ratings and reviews.

### Ratings
- `POST /api/ratings` – Submit or update a 1–5 star rating for a movie.
- `GET /api/ratings/me` – Retrieve all ratings submitted by the current user.

### Reviews
- `GET /api/reviews?movieId=` – List community reviews for a movie.
- `POST /api/reviews` – Submit a written review.
- `PUT /api/reviews/:id` – Edit personal review.
- `DELETE /api/reviews/:id` – Delete personal review (or admin moderation).
- `GET /api/reviews/me` – List all reviews authored by the current user.

### Watchlist
- `GET /api/watchlist` – Fetch current user's saved movies.
- `POST /api/watchlist` – Add a movie to the watchlist.
- `DELETE /api/watchlist/:movieId` – Remove a movie from the watchlist.

### Admin
- `GET /api/admin/stats` – Platform metric totals (movies, users, reviews, ratings, average rating).
- `GET /api/admin/users` – List all registered user accounts.
- `GET /api/admin/reviews` – Moderation view for all reviews across all movies.

---

## Demo Credentials

For quick evaluation, pre-seeded accounts are readily available via the **1-Click Demo** buttons inside the Sign In modal:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@cinerate.com` | `Admin@123` |
| **Standard Member** | `alex@cinerate.com` | `User@123` |

---

## Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/your-username/cinerate.git
cd cinerate
npm install
```

### 2. Environment Variables Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cinerate"
JWT_SECRET="cinerate_super_secure_jwt_secret_key_2026_change_in_production"
PORT=3000
NODE_ENV=development
```

### 3. Initialize Database (Optional if using live PostgreSQL)
Run the script in `database/schema.sql` against your PostgreSQL database:
```bash
psql -U postgres -d cinerate -f database/schema.sql
```
*(If no external database is configured, the application automatically boots using the embedded data store with full seed data).*

### 4. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Vercel Deployment Instructions

### 1. Create a PostgreSQL Database
You can use **Supabase** or **Neon**:
1. Go to [Supabase](https://supabase.com) or [Neon](https://neon.tech) and create a free PostgreSQL project.
2. In the database dashboard, navigate to the **SQL Editor**.
3. Paste the contents of `database/schema.sql` and run it to create tables, indexes, and initial seeds.
4. Copy the PostgreSQL Connection String (`postgresql://postgres:...`).

### 2. Push Code to GitHub
Ensure all your files are committed and pushed to your repository:
```bash
git add .
git commit -m "Deploy CineRate Portal"
git push origin main
```

### 3. Connect to Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New..." > "Project"**.
2. Select your GitHub repository.
3. Keep the default Build Command (`npm run build`) and Output Directory (`dist`).

### 4. Configure Environment Variables on Vercel
In the Vercel project deployment settings, add the following under **Environment Variables**:
- `DATABASE_URL`: Your Supabase or Neon PostgreSQL connection URI.
- `JWT_SECRET`: A secure random secret string for token signing.
- `NODE_ENV`: `production`

### 5. Deploy & Verify
1. Click **Deploy**. Vercel will build the frontend assets and prepare serverless routes.
2. Once deployed, open your production URL.
3. Test signing in with `admin@cinerate.com`, browsing movies, rating a film, adding to watchlist, and managing movies via the Admin Dashboard.

---

## Future Improvements

- User avatar image uploads via cloud storage (S3 / Cloud Storage).
- Critic vs Audience split rating badges.
- Social sharing previews with OpenGraph dynamic metadata per movie.
- Custom user-created lists (e.g., "Favorite Sci-Fi of the 2020s").
