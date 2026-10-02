-- ============================================================
-- CineRate: Movie Information & Rating Portal
-- PostgreSQL Database Schema & Initial Seed Data
-- ============================================================

-- Drop tables if they already exist (in reverse dependency order)
DROP TABLE IF EXISTS watchlist CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Movies Table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_year INTEGER NOT NULL CHECK (release_year >= 1888 AND release_year <= 2100),
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

-- 3. Ratings Table (One rating per user per movie)
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_rating UNIQUE (user_id, movie_id)
);

-- 4. Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Watchlist Table (One entry per user per movie)
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_watchlist UNIQUE (user_id, movie_id)
);

-- Performance Indexes
CREATE INDEX idx_movies_title ON movies (LOWER(title));
CREATE INDEX idx_movies_genre ON movies (genre);
CREATE INDEX idx_movies_year ON movies (release_year);
CREATE INDEX idx_movies_language ON movies (language);
CREATE INDEX idx_ratings_movie_id ON ratings (movie_id);
CREATE INDEX idx_ratings_user_id ON ratings (user_id);
CREATE INDEX idx_reviews_movie_id ON reviews (movie_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);
CREATE INDEX idx_watchlist_user_id ON watchlist (user_id);

-- ============================================================
-- Seed Data: Sample Users
-- Pre-hashed passwords (bcrypt):
-- Admin@123 -> $2a$10$yFfM6wF1Kj9Q3bWbEaP.w.l9qG7.N1gMeqgU4o9qS9u2aR9Tf3v2u (or dynamically hashed)
-- ============================================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Elena Rostova (Admin)', 'admin@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'admin'),
('Alex Mercer', 'alex@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'user'),
('Sarah Connor', 'sarah@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'user'),
('Marcus Vance', 'marcus@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'user');

-- ============================================================
-- Seed Data: Realistic Movie Catalog
-- ============================================================
INSERT INTO movies (title, description, release_year, genre, language, duration, director, cast_members, poster_url, backdrop_url, trailer_url, featured) VALUES
(
    'Interstellar Odyssey',
    'A team of pioneering astrophysicists and deep-space explorers travel through a newly opened cosmic wormhole in search of a viable sanctuary for endangered humanity.',
    2024,
    'Sci-Fi',
    'English',
    '2h 49m',
    'Christopher Sterling',
    'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    TRUE
),
(
    'Neon Horizon: 2088',
    'In a rain-soaked cyberpunk metropolis controlled by synthetic intelligence syndicates, an augmented detective uncovers an existential conspiracy linking corporate titans to human memory erasure.',
    2025,
    'Cyberpunk / Sci-Fi',
    'English',
    '2h 14m',
    'Denis Villeneuve',
    'Ryan Gosling, Ana de Armas, Harrison Ford, Sylvia Hoeks',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=gCcx85zbxz4',
    TRUE
),
(
    'The Kyoto Echo',
    'An intimate drama unfolding in the historic alleyways of Kyoto, exploring three generations of traditional tea masters grappling with contemporary societal changes.',
    2024,
    'Drama',
    'Japanese',
    '1h 56m',
    'Hirokazu Kore-eda',
    'Koji Yakusho, Sakura Ando, Lily Franky, Mayu Matsuoka',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=1F3hm6MfR1k',
    FALSE
),
(
    'Shadows in the Mist',
    'A veteran alpine search-and-rescue specialist investigates a string of inexplicable disappearances across the treacherous Pyrenees mountain range during a blizzard.',
    2023,
    'Thriller',
    'French',
    '2h 08m',
    'Justine Triet',
    'Sandra Hüller, Swann Arlaud, Milo Machado-Graner, Antoine Reinartz',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=fTr7h7kQpB8',
    FALSE
),
(
    'Chronicles of Eldoria',
    'When ancient elemental seals shatter beneath the forgotten ruins of Eldoria, an exiled cartographer must unite fractured rival kingdoms before eternal darkness descends.',
    2025,
    'Fantasy',
    'English',
    '2h 38m',
    'Guillermo del Toro',
    'Dev Patel, Florence Pugh, Mads Mikkelsen, Cate Blanchett',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=d9MyW72ELq0',
    FALSE
),
(
    'Midnight in Madrid',
    'A whirlwind romance ignites between an art restorer on the run and an enigmatic flamenco guitarist as they navigate a high-stakes museum heist across Spain.',
    2024,
    'Romance / Comedy',
    'Spanish',
    '1h 48m',
    'Pedro Almodóvar',
    'Penélope Cruz, Antonio Banderas, Javier Bardem, Blanca Suárez',
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=Yrz3B8hZ9Zk',
    FALSE
),
(
    'Seoul Velocity',
    'An elite undercover traffic investigator infiltrates the perilous underground electric street racing syndicate operating in the neon highways of futuristic Seoul.',
    2025,
    'Action',
    'Korean',
    '2h 05m',
    'Bong Joon-ho',
    'Song Kang-ho, Park So-dam, Choi Woo-shik, Lee Sun-kyun',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=5xH0Hf13u5g',
    FALSE
),
(
    'The Symphony of Silence',
    'Based on an extraordinary true story of a visionary conductor who loses his hearing during the peak of the 1920s jazz revolution and invents a new sensory form of musical notation.',
    2023,
    'Drama / Music',
    'English',
    '2h 21m',
    'Damien Chazelle',
    'Bradley Cooper, Carey Mulligan, Matt Bomer, Maya Hawke',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=ga1m0456Vb4',
    FALSE
),
(
    'Quantum Labyrinth',
    'A rogue theoretical physicist discovers that every time she makes a conscious decision, her laboratory splits into divergent timelines that threaten to collapse the fabric of spacetime.',
    2026,
    'Sci-Fi / Mystery',
    'English',
    '2h 17m',
    'Alex Garland',
    'Natalie Portman, Oscar Isaac, Tessa Thompson, Jennifer Jason Leigh',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=89OP78l9W1k',
    FALSE
),
(
    'The Alpine Heist',
    'A crew of international master lockpicks attempts an impossible extraction from an impenetrable vault carved into the heart of a Swiss glacier during an avalanche.',
    2024,
    'Action / Crime',
    'German',
    '2h 02m',
    'Edward Berger',
    'Daniel Brühl, Sebastian Koch, Paula Beer, Albrecht Schuch',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=W6N8l293eX0',
    FALSE
),
(
    'Whispers in the Stacks',
    'In a sprawling Victorian archive, a meticulous conservator discovers encoded watermarks in rare medieval manuscripts that foretell historic global cataclysms.',
    2023,
    'Mystery / Drama',
    'English',
    '1h 58m',
    'Kenneth Branagh',
    'Kenneth Branagh, Emma Thompson, Colin Firth, Judi Dench',
    'https://images.unsplash.com/photo-1507842229452-976932454b8d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=qM79_itR0Nc',
    FALSE
),
(
    'The Last Canopy',
    'A courageous botanical expedition deep in the uncharted Amazon basin uncovers a sentient bioluminescent biome that holds the cure to a worldwide atmospheric degradation.',
    2025,
    'Adventure / Sci-Fi',
    'Spanish',
    '2h 11m',
    'Alejandro G. Iñárritu',
    'Gael García Bernal, Salma Hayek, Diego Luna, Wagner Moura',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1600&auto=format&fit=crop',
    'https://www.youtube.com/watch?v=73_1biulkYk',
    FALSE
);

-- ============================================================
-- Seed Data: Sample Ratings
-- ============================================================
INSERT INTO ratings (user_id, movie_id, rating) VALUES
(2, 1, 5),
(3, 1, 5),
(4, 1, 4),
(2, 2, 5),
(3, 2, 4),
(4, 2, 5),
(2, 3, 5),
(3, 3, 5),
(2, 4, 4),
(4, 4, 4),
(2, 5, 4),
(3, 5, 5),
(2, 6, 4),
(4, 6, 4),
(3, 7, 5),
(4, 7, 4),
(2, 8, 5),
(3, 8, 4),
(4, 9, 4),
(2, 10, 4);

-- ============================================================
-- Seed Data: Sample Reviews
-- ============================================================
INSERT INTO reviews (user_id, movie_id, review_text) VALUES
(2, 1, 'An astonishing cinematic masterpiece. The auditory sound design combined with theoretical physics visuals left me spellbound from start to finish.'),
(3, 1, 'Transcendent emotional core beneath awe-inspiring interstellar scale. Zimmer-esque scoring elevated every tense sequence.'),
(2, 2, 'The atmospheric cinematography in Neon Horizon sets a new benchmark for cyberpunk cinema. Truly mesmerizing visual effects.'),
(4, 2, 'Intricate philosophical questions regarding consciousness and soul in an artificial era. A modern classic in every sense.'),
(2, 3, 'Quiet, profoundly moving portrayal of human connections and tradition. The pacing is deliberate and rewarding.'),
(3, 5, 'Spectacular world-building that honors classic fantasy while introducing fresh mythological motifs.');

-- ============================================================
-- Seed Data: Sample Watchlist
-- ============================================================
INSERT INTO watchlist (user_id, movie_id) VALUES
(2, 2),
(2, 5),
(2, 7),
(2, 9),
(3, 1),
(3, 6);
