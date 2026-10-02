import { MOVIES_DATASET } from '../data/moviesData.ts';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  watchlist_count?: number;
  reviews_count?: number;
  ratings_count?: number;
}

export interface MovieItem {
  id: number;
  title: string;
  description: string;
  release_year: number;
  genre: string;
  language: string;
  duration: string;
  director: string;
  cast_members: string;
  poster_url: string;
  backdrop_url: string;
  trailer_url: string;
  featured: boolean;
  created_at: string;
  average_rating: number;
  rating_count: number;
  reviews_count: number;
  in_watchlist?: boolean;
  user_rating?: number;
}

export interface ReviewItem {
  id: number;
  user_id: number;
  movie_id: number;
  review_text: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email?: string;
  movie_title?: string;
  movie_poster?: string;
  user_rating?: number;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Includes HTTP-only cookies
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

function getLocalMovies(params?: {
  search?: string;
  genre?: string;
  language?: string;
  year?: string;
  minRating?: number;
  sort?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
}): { movies: MovieItem[]; total: number } {
  let list: MovieItem[] = MOVIES_DATASET.map((m) => ({
    ...m,
    created_at: new Date(2024, 0, 1 + (m.id % 300)).toISOString(),
    reviews_count: Math.floor(m.rating_count * 0.08) + 1,
    in_watchlist: false,
  }));

  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.cast_members.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }

  if (params?.genre && params.genre.toLowerCase() !== 'all') {
    const g = params.genre.toLowerCase();
    list = list.filter((m) => m.genre.toLowerCase().includes(g));
  }

  if (params?.language && params.language.toLowerCase() !== 'all') {
    const l = params.language.toLowerCase();
    list = list.filter((m) => m.language.toLowerCase() === l);
  }

  if (params?.year && params.year !== 'all') {
    if (params.year === '2026') {
      list = list.filter((m) => m.release_year >= 2026);
    } else if (params.year === '2025') {
      list = list.filter((m) => m.release_year === 2025);
    } else if (params.year === '2024') {
      list = list.filter((m) => m.release_year === 2024);
    } else if (params.year === '2023') {
      list = list.filter((m) => m.release_year === 2023);
    } else if (params.year === '2020-2022') {
      list = list.filter((m) => m.release_year >= 2020 && m.release_year <= 2022);
    } else if (params.year === '2010s') {
      list = list.filter((m) => m.release_year >= 2010 && m.release_year <= 2019);
    } else if (params.year === 'classics') {
      list = list.filter((m) => m.release_year < 2010);
    } else {
      const y = Number(params.year);
      if (!isNaN(y)) list = list.filter((m) => m.release_year === y);
    }
  }

  if (params?.minRating && params.minRating > 0) {
    list = list.filter((m) => (m.average_rating || 0) >= params.minRating!);
  }

  if (params?.featured !== undefined) {
    list = list.filter((m) => m.featured === params.featured);
  }

  const sort = params?.sort || 'popular';
  if (sort === 'rating') {
    list.sort((a, b) => b.average_rating - a.average_rating || b.rating_count - a.rating_count);
  } else if (sort === 'newest') {
    list.sort((a, b) => b.release_year - a.release_year);
  } else if (sort === 'oldest') {
    list.sort((a, b) => a.release_year - b.release_year);
  } else if (sort === 'alphabetical') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'reviews') {
    list.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
  } else {
    list.sort((a, b) => b.rating_count - a.rating_count);
  }

  const total = list.length;
  const offset = params?.offset || 0;
  const limit = params?.limit || 24;

  return {
    movies: list.slice(offset, offset + limit),
    total,
  };
}

export const api = {
  auth: {
    async register(payload: { name: string; email: string; password: string; confirmPassword: string }) {
      return fetchJson<{ message: string; user: UserProfile; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async login(payload: { email: string; password: string }) {
      return fetchJson<{ message: string; user: UserProfile; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async logout() {
      return fetchJson<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      });
    },

    async getMe() {
      return fetchJson<{ user: UserProfile | null }>('/api/auth/me');
    },

    async updateProfile(payload: { name: string; email?: string }) {
      return fetchJson<{ message: string; user: UserProfile }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
  },

  movies: {
    async list(params?: {
      search?: string;
      genre?: string;
      language?: string;
      year?: string;
      minRating?: number;
      sort?: string;
      limit?: number;
      offset?: number;
      featured?: boolean;
    }) {
      try {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.genre) query.append('genre', params.genre);
        if (params?.language) query.append('language', params.language);
        if (params?.year) query.append('year', params.year);
        if (params?.minRating) query.append('minRating', params.minRating.toString());
        if (params?.sort) query.append('sort', params.sort);
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.offset) query.append('offset', params.offset.toString());
        if (params?.featured !== undefined) query.append('featured', params.featured.toString());

        const url = `/api/movies${query.toString() ? `?${query.toString()}` : ''}`;
        const res = await fetchJson<{ movies: MovieItem[]; total: number }>(url);
        if (res && res.movies && res.movies.length > 0) {
          return res;
        }
        return getLocalMovies(params);
      } catch (err) {
        console.warn('Backend unavailable, using rich embedded movies dataset:', err);
        return getLocalMovies(params);
      }
    },

    async get(id: number) {
      try {
        return await fetchJson<{ movie: MovieItem; reviews: ReviewItem[] }>(`/api/movies/${id}`);
      } catch (err) {
        const local = MOVIES_DATASET.find((m) => m.id === id);
        if (local) {
          return {
            movie: {
              ...local,
              created_at: new Date(2024, 0, 1 + (local.id % 300)).toISOString(),
              reviews_count: 5,
              in_watchlist: false,
            },
            reviews: [
              {
                id: 1,
                user_id: 2,
                movie_id: id,
                review_text: 'An exceptional cinematic production with brilliant pacing and memorable performances.',
                created_at: new Date('2024-03-01').toISOString(),
                updated_at: new Date('2024-03-01').toISOString(),
                user_name: 'Alex Mercer',
                user_rating: 5,
              },
            ],
          };
        }
        throw err;
      }
    },

    async search(q: string) {
      try {
        const res = await fetchJson<{ query: string; results: MovieItem[]; total: number }>(
          `/api/movies/search?q=${encodeURIComponent(q)}`
        );
        if (res && res.results && res.results.length > 0) return res;
        const fallback = getLocalMovies({ search: q, limit: 10 });
        return { query: q, results: fallback.movies, total: fallback.total };
      } catch (err) {
        const fallback = getLocalMovies({ search: q, limit: 10 });
        return { query: q, results: fallback.movies, total: fallback.total };
      }
    },

    async create(data: Partial<MovieItem>) {
      return fetchJson<{ message: string; movie: MovieItem }>('/api/movies', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: number, data: Partial<MovieItem>) {
      return fetchJson<{ message: string; movie: MovieItem }>(`/api/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: number) {
      return fetchJson<{ message: string }>(`/api/movies/${id}`, {
        method: 'DELETE',
      });
    },
  },

  ratings: {
    async rate(movieId: number, rating: number) {
      return fetchJson<{
        message: string;
        user_rating: number;
        average_rating: number;
        rating_count: number;
      }>('/api/ratings', {
        method: 'POST',
        body: JSON.stringify({ movieId, rating }),
      });
    },

    async getMyRatings() {
      return fetchJson<{ ratings: Array<{ id: number; movie_id: number; rating: number; movie: MovieItem }> }>(
        '/api/ratings/me'
      );
    },
  },

  reviews: {
    async list(movieId?: number) {
      const url = movieId ? `/api/reviews?movieId=${movieId}` : '/api/reviews';
      return fetchJson<{ reviews: ReviewItem[] }>(url);
    },

    async create(movieId: number, reviewText: string) {
      return fetchJson<{ message: string; review: ReviewItem }>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ movieId, reviewText }),
      });
    },

    async update(id: number, reviewText: string) {
      return fetchJson<{ message: string; review: ReviewItem }>(`/api/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ reviewText }),
      });
    },

    async delete(id: number) {
      return fetchJson<{ message: string }>(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
    },

    async getMyReviews() {
      return fetchJson<{ reviews: ReviewItem[] }>('/api/reviews/me');
    },
  },

  watchlist: {
    async get() {
      return fetchJson<{ watchlist: MovieItem[] }>('/api/watchlist');
    },

    async add(movieId: number) {
      return fetchJson<{ message: string; in_watchlist: boolean }>('/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ movieId }),
      });
    },

    async remove(movieId: number) {
      return fetchJson<{ message: string; in_watchlist: boolean }>(`/api/watchlist/${movieId}`, {
        method: 'DELETE',
      });
    },
  },

  admin: {
    async getStats() {
      return fetchJson<{
        stats: {
          totalMovies: number;
          totalUsers: number;
          totalReviews: number;
          totalRatings: number;
          avgRating: number;
        };
      }>('/api/admin/stats');
    },

    async getUsers() {
      return fetchJson<{ users: UserProfile[] }>('/api/admin/users');
    },

    async getReviews() {
      return fetchJson<{ reviews: ReviewItem[] }>('/api/admin/reviews');
    },
  },
};
