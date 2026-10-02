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
      return fetchJson<{ movies: MovieItem[]; total: number }>(url);
    },

    async get(id: number) {
      return fetchJson<{ movie: MovieItem; reviews: ReviewItem[] }>(`/api/movies/${id}`);
    },

    async search(q: string) {
      return fetchJson<{ query: string; results: MovieItem[]; total: number }>(
        `/api/movies/search?q=${encodeURIComponent(q)}`
      );
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
