import React, { useState, useEffect } from 'react';
import { Compass, Film, ArrowRight } from 'lucide-react';
import { api, MovieItem } from '../lib/api.ts';

interface GenresPageProps {
  onSelectGenre: (genre: string) => void;
}

export const GenresPage: React.FC<GenresPageProps> = ({ onSelectGenre }) => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await api.movies.list({ limit: 100 });
        setMovies(data.movies);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const genres = [
    {
      name: 'Sci-Fi',
      desc: 'Dystopian futures, artificial intelligence, cosmic wormholes, and theoretical physics.',
      bg: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Action',
      desc: 'High-octane pursuits, pulse-pounding heists, explosive stunts, and heroic struggles.',
      bg: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Drama',
      desc: 'Intimate human narratives, profound relationships, historical stakes, and emotion.',
      bg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Thriller',
      desc: 'Psychological tension, edge-of-your-seat suspense, paranoia, and unexpected twists.',
      bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Fantasy',
      desc: 'Mythical realms, ancient sorcery, legendary creatures, and timeless epics.',
      bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Romance',
      desc: 'Heartfelt passions, European adventures, artistic romance, and charming comedy.',
      bg: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Mystery',
      desc: 'Enigmatic puzzle boxes, coded archives, detectives, and covert secrets.',
      bg: 'https://images.unsplash.com/photo-1507842229452-976932454b8d?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Adventure',
      desc: 'Uncharted wilderness expeditions, ancient lost cities, and botanical wonders.',
      bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Cinematic Categories</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
          Browse by Genre
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select a category to filter our verified catalog by style, atmosphere, and narrative tone.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {genres.map((g) => {
          const matchingCount = movies.filter((m) =>
            m.genre.toLowerCase().includes(g.name.toLowerCase())
          ).length;

          return (
            <div
              key={g.name}
              onClick={() => onSelectGenre(g.name)}
              className="group relative rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/50 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] aspect-[4/5] flex flex-col justify-end p-6 bg-slate-950"
            >
              <img
                src={g.bg}
                alt={g.name}
                className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-2xl text-white group-hover:text-amber-400 transition-colors">
                    {g.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {matchingCount > 0 ? `${matchingCount} titles` : 'Catalog'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{g.desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold pt-1">
                  <span>Explore Films</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
