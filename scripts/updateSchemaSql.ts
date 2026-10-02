import fs from 'fs';
import path from 'path';
import { MOVIES_DATASET } from '../src/data/moviesData.ts';

const schemaPrefix = `-- ============================================================
-- CineRate: Movie Information & Rating Portal
-- PostgreSQL Database Schema & 1,000+ Movies Seed Data
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

-- 3. Ratings Table
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

-- 5. Watchlist Table
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
-- ============================================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Elena Rostova (Admin)', 'admin@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'admin'),
('Alex Mercer', 'alex@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'user'),
('Sarah Connor', 'sarah@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'user'),
('Marcus Vance', 'marcus@cinerate.com', '$2a$10$Q7yE7xW9P9d1a3c5e7g9huz1K8iX2mO4nL6pQ8rT0vV2xY4zA6bCe', 'user');

-- ============================================================
-- Seed Data: 1,000+ Movies Catalog
-- ============================================================
`;

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

let movieInserts = 'INSERT INTO movies (id, title, description, release_year, genre, language, duration, director, cast_members, poster_url, backdrop_url, trailer_url, featured) VALUES\n';

const rows = MOVIES_DATASET.map((m) => {
  return `(${m.id}, '${escapeSql(m.title)}', '${escapeSql(m.description)}', ${m.release_year}, '${escapeSql(m.genre)}', '${escapeSql(m.language)}', '${escapeSql(m.duration)}', '${escapeSql(m.director)}', '${escapeSql(m.cast_members)}', '${escapeSql(m.poster_url)}', '${escapeSql(m.backdrop_url)}', '${escapeSql(m.trailer_url)}', ${m.featured ? 'TRUE' : 'FALSE'})`;
});

movieInserts += rows.join(',\n') + ';\n\n';

const suffix = `
-- Reset movies sequence to allow new additions
SELECT setval('movies_id_seq', (SELECT MAX(id) FROM movies));

-- ============================================================
-- Seed Data: Sample Ratings
-- ============================================================
INSERT INTO ratings (user_id, movie_id, rating) VALUES
(2, 1, 5), (3, 1, 5), (4, 1, 4),
(2, 2, 5), (3, 2, 4), (4, 2, 5),
(2, 3, 5), (3, 3, 5), (2, 4, 4),
(4, 4, 4), (2, 5, 4), (3, 5, 5),
(2, 6, 4), (4, 6, 4), (3, 7, 5),
(4, 7, 4), (2, 8, 5), (3, 8, 4),
(4, 9, 4), (2, 10, 4);

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
(2, 2), (2, 5), (2, 7), (2, 9), (3, 1), (3, 6);
`;

const fullSql = schemaPrefix + movieInserts + suffix;
fs.writeFileSync(path.resolve('./database/schema.sql'), fullSql);
console.log('Successfully wrote 1,000+ movies to database/schema.sql');
