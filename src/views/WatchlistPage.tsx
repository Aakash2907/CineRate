import React, { useState, useEffect } from 'react';
import { Bookmark, Search, Trash2, ArrowRight, Film } from 'lucide-react';
import { MovieItem, api } from '../lib/api.ts';
import { MovieCard } from '../components/MovieCard.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface WatchlistPageProps {
  onSelectMovie: (movieId: number) => void;
  onNavigate: (view: string) => void;
  onPlayTrailer: (movie: MovieItem) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  onSelectMovie,
  onNavigate,
  onPlayTrailer,
}) => {
  const { user, openAuthModal, refreshUser } = useAuth();
  const { toast } = useToast();

  const [watchlist, setWatchlist] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const loadWatchlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.watchlist.get();
      setWatchlist(data.watchlist);
    } catch (err: any) {
      toast(err.message || 'Failed to retrieve watchlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, [user]);

  const handleRemove = async (movieId: number) => {
    try {
      await api.watchlist.remove(movieId);
      setWatchlist(watchlist.filter((m) => m.id !== movieId));
      toast('Movie removed from your watchlist', 'info');
      refreshUser();
    } catch (err: any) {
      toast(err.message || 'Failed to remove movie', 'error');
    }
  };

  const filteredMovies = watchlist.filter((m) =>
    m.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.genre.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.director.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (!user) {
    return (
      <div className="py-20 max-w-md mx-auto text-center glass-panel rounded-3xl border border-slate-800 p-8 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white">Your Personal Watchlist</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Sign in or create an account to save films you want to watch later, track recommendations, and rate them after viewing.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all"
        >
          Sign In to View Watchlist
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
            <span>Saved Titles</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            My Watchlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            You have saved {watchlist.length} {watchlist.length === 1 ? 'film' : 'films'} to watch.
          </p>
        </div>

        {/* Filter input */}
        {watchlist.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search watchlist..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white placeholder-slate-500 pl-10 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-slate-900/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 max-w-md mx-auto p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the bookmark icon on any movie poster or details page to build your queue.
          </p>
          <button
            onClick={() => onNavigate('movies')}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all inline-flex items-center gap-2"
          >
            <span>Explore Movies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard
                movie={movie}
                onSelect={onSelectMovie}
                onPlayTrailer={onPlayTrailer}
                onWatchlistChange={(id, inList) => {
                  if (!inList) handleRemove(id);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
