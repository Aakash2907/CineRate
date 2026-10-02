import React, { useState, useEffect } from 'react';
import { X, Film, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { MovieItem } from '../lib/api.ts';

interface MovieFormModalProps {
  movie?: MovieItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MovieItem>) => Promise<void>;
}

export const MovieFormModal: React.FC<MovieFormModalProps> = ({
  movie,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState(2025);
  const [genre, setGenre] = useState('Sci-Fi');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('2h 15m');
  const [director, setDirector] = useState('');
  const [castMembers, setCastMembers] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (movie) {
      setTitle(movie.title);
      setDescription(movie.description);
      setReleaseYear(movie.release_year);
      setGenre(movie.genre);
      setLanguage(movie.language || 'English');
      setDuration(movie.duration || '2h 00m');
      setDirector(movie.director);
      setCastMembers(movie.cast_members || '');
      setPosterUrl(movie.poster_url);
      setBackdropUrl(movie.backdrop_url || movie.poster_url);
      setTrailerUrl(movie.trailer_url || '');
      setFeatured(Boolean(movie.featured));
    } else {
      setTitle('');
      setDescription('');
      setReleaseYear(2025);
      setGenre('Sci-Fi');
      setLanguage('English');
      setDuration('2h 15m');
      setDirector('');
      setCastMembers('');
      setPosterUrl('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop');
      setBackdropUrl('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop');
      setTrailerUrl('https://www.youtube.com/watch?v=zSWdZVtXT7E');
      setFeatured(false);
    }
    setError(null);
  }, [movie, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        title,
        description,
        release_year: Number(releaseYear),
        genre,
        language,
        duration,
        director,
        cast_members: castMembers,
        poster_url: posterUrl,
        backdrop_url: backdropUrl || posterUrl,
        trailer_url: trailerUrl,
        featured,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save movie details.');
    } finally {
      setLoading(false);
    }
  };

  const genresList = [
    'Sci-Fi',
    'Action',
    'Drama',
    'Thriller',
    'Fantasy',
    'Romance',
    'Comedy',
    'Mystery',
    'Adventure',
    'Crime',
    'Animation',
    'Horror',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                {movie ? 'Edit Movie Details' : 'Add New Movie to CineRate'}
              </h3>
              <p className="text-xs text-slate-400">
                {movie ? 'Update information for this title.' : 'Enter complete movie specifications for the catalog.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-600/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Movie Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dune: Part Two"
                className="w-full bg-slate-950 text-sm text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Synopsis / Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter storyline, plot overview, and critical synopsis..."
                className="w-full bg-slate-950 text-sm text-white placeholder-slate-500 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Release Year *</label>
              <input
                type="number"
                required
                min={1888}
                max={2100}
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Genre *</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              >
                {genresList.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Language *</label>
              <input
                type="text"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g. English, French, Japanese..."
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Runtime / Duration *</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2h 15m"
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Director *</label>
              <input
                type="text"
                required
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="e.g. Christopher Nolan"
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cast Members</label>
              <input
                type="text"
                value={castMembers}
                onChange={(e) => setCastMembers(e.target.value)}
                placeholder="Comma separated: Cillian Murphy, Emily Blunt..."
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Poster Image URL *</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Backdrop Image URL</label>
              <input
                type="url"
                value={backdropUrl}
                onChange={(e) => setBackdropUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (wide banner image)"
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Trailer URL (YouTube)</label>
              <input
                type="url"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-950 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-amber-500 focus:ring-amber-400 bg-slate-950 cursor-pointer"
              />
              <label htmlFor="featuredCheck" className="text-xs font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Feature this movie prominently on the home hero banner and showcase
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : movie ? 'Update Movie' : 'Create Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
