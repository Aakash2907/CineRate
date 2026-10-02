import { useState, useEffect } from 'react';
import { MovieItem } from './api.ts';
import { MOVIES_DATASET } from '../data/moviesData.ts';

const SESSION_STORAGE_KEY = 'cinerate_recently_viewed_session';
const EVENT_NAME = 'cinerate_recently_viewed_updated';
const MAX_RECENT_MOVIES = 5;

/**
 * Retrieve the current session's recently viewed movies (max 5)
 */
export function getRecentlyViewedMovies(): MovieItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT_MOVIES) : [];
  } catch {
    return [];
  }
}

/**
 * Record a movie as viewed in the current session (max 5, MRU order)
 */
export function recordRecentlyViewedMovie(movie: MovieItem): void {
  if (typeof window === 'undefined' || !movie || !movie.id) return;
  try {
    const current = getRecentlyViewedMovies();
    // Filter out existing occurrence to move to the front
    const filtered = current.filter((m) => Number(m.id) !== Number(movie.id));
    const updated = [movie, ...filtered].slice(0, MAX_RECENT_MOVIES);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.warn('Unable to record recently viewed movie:', err);
  }
}

/**
 * Record a movie by its numeric ID
 */
export function recordRecentlyViewedId(movieId: number | string): void {
  const numId = Number(movieId);
  if (isNaN(numId) || numId <= 0) return;
  
  const found = MOVIES_DATASET.find((m) => Number(m.id) === numId);
  if (found) {
    const movieItem: MovieItem = {
      ...found,
      created_at: new Date().toISOString(),
      reviews_count: 5,
      in_watchlist: false,
    };
    recordRecentlyViewedMovie(movieItem);
  }
}

/**
 * Remove a specific movie from recently viewed session history
 */
export function removeRecentlyViewedMovie(movieId: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentlyViewedMovies();
    const updated = current.filter((m) => Number(m.id) !== Number(movieId));
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch {}
}

/**
 * Clear all recently viewed movies for the current session
 */
export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: [] }));
  } catch {}
}

/**
 * Custom React hook for subscribing to recently viewed movies in the current session
 */
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<MovieItem[]>([]);

  useEffect(() => {
    // Initial read
    setRecentlyViewed(getRecentlyViewedMovies());

    const handleUpdate = () => {
      setRecentlyViewed(getRecentlyViewedMovies());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    recentlyViewed,
    clearHistory: clearRecentlyViewed,
    removeMovie: removeRecentlyViewedMovie,
    recordMovie: recordRecentlyViewedMovie,
  };
}
