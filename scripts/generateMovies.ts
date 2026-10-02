import fs from 'fs';
import path from 'path';

interface MovieSeed {
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
  average_rating: number;
  rating_count: number;
}

const posters = [
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507842229452-976932454b8d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop',
];

const backdrops = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1600&auto=format&fit=crop',
];

const genres = [
  'Sci-Fi', 'Action', 'Drama', 'Thriller', 'Fantasy', 'Romance',
  'Comedy', 'Mystery', 'Adventure', 'Crime', 'Animation', 'Horror',
];

const languages = [
  'English', 'Japanese', 'French', 'Spanish', 'Korean', 'German', 'Italian', 'Hindi'
];

const directors = [
  'Christopher Nolan', 'Denis Villeneuve', 'Martin Scorsese', 'Quentin Tarantino',
  'Guillermo del Toro', 'Bong Joon-ho', 'Greta Gerwig', 'David Fincher',
  'Steven Spielberg', 'Ridley Scott', 'Hirokazu Kore-eda', 'Justine Triet',
  'Damien Chazelle', 'Kenneth Branagh', 'Edward Berger', 'Alejandro G. Iñárritu',
  'Wes Anderson', 'Alfonso Cuarón', 'Hayao Miyazaki', 'Park Chan-wook',
  'Coen Brothers', 'Paul Thomas Anderson', 'George Miller', 'Jordan Peele',
  'Yorgos Lanthimos', 'James Cameron', 'Sam Mendes', 'Danny Boyle'
];

const castPool = [
  'Leonardo DiCaprio', 'Cillian Murphy', 'Florence Pugh', 'Ryan Gosling',
  'Margot Robbie', 'Brad Pitt', 'Cate Blanchett', 'Timothée Chalamet',
  'Zendaya', 'Christian Bale', 'Emily Blunt', 'Matthew McConaughey',
  'Jessica Chastain', 'Oscar Isaac', 'Natalie Portman', 'Song Kang-ho',
  'Penélope Cruz', 'Daniel Brühl', 'Koji Yakusho', 'Mads Mikkelsen',
  'Dev Patel', 'Ana de Armas', 'Joaquin Phoenix', 'Emma Stone',
  'Denzel Washington', 'Willem Dafoe', 'Marion Cotillard', 'Michael Fassbender'
];

const adjectives = [
  'Eternal', 'Silent', 'Golden', 'Dark', 'Lethal', 'Cosmic', 'Shattered', 'Crimson',
  'Midnight', 'Quantum', 'Lost', 'Forgotten', 'Infinite', 'Savage', 'Brilliant',
  'Phantom', 'Iron', 'Velvet', 'Frozen', 'Neon', 'Hollow', 'Radiant', 'Furious',
  'Secret', 'Final', 'Hidden', 'Astral', 'Broken', 'Endless', 'Fierce', 'Obsidian',
  'Solar', 'Vulnerable', 'Vengeful', 'Echoing', 'Sacred', 'Blind', 'Resilient'
];

const nouns = [
  'Horizon', 'Echo', 'Odyssey', 'Protocol', 'Legacy', 'Labyrinth', 'Sanctuary',
  'Kingdom', 'Chronicle', 'Shadow', 'Symphony', 'Empire', 'Conspiracy', 'Voyage',
  'Alliance', 'Dimension', 'Mirage', 'Requiem', 'Frontier', 'Cipher', 'Vortex',
  'Parable', 'Paradox', 'Ascent', 'Destiny', 'Rebellion', 'Illusion', 'Tide',
  'Artifact', 'Threshold', 'Serpent', 'Eclipse', 'Oasis', 'Monolith', 'Fortress'
];

const storylineTemplates = [
  'A high-stakes narrative following a determined specialist racing against time across mysterious territories.',
  'An extraordinary tale exploring sacrifice, loyalty, and redemption when an unexpected discovery changes everything.',
  'Caught between conflicting loyalties, a courageous protagonist must navigate deceit and survival in a changing world.',
  'A gripping investigation that unravels deeply hidden truths within a sprawling corporate and political underworld.',
  'When an unforeseen crisis erupts, an unlikely team must unite to prevent a cataclysmic turning point for society.',
  'A deeply emotional character study focusing on legacy, memory, and relationships against an epic backdrop.',
  'A relentless pursuit across borders that tests endurance, honor, and courage when the stakes are existential.',
  'An unforgettable odyssey where boundaries between reality and perception blur into a breathtaking spectacle.'
];

export function generate1000Movies(): MovieSeed[] {
  const movies: MovieSeed[] = [];
  const usedTitles = new Set<string>();

  // Add the initial 12 handcrafted movies first
  const handcrafted: MovieSeed[] = [
    {
      id: 1,
      title: 'Interstellar Odyssey',
      description: 'A team of pioneering astrophysicists and deep-space explorers travel through a newly opened cosmic wormhole in search of a viable planetary sanctuary for endangered humanity.',
      release_year: 2024,
      genre: 'Sci-Fi',
      language: 'English',
      duration: '2h 49m',
      director: 'Christopher Sterling',
      cast_members: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
      poster_url: posters[0],
      backdrop_url: backdrops[0],
      trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      featured: true,
      average_rating: 4.8,
      rating_count: 1420,
    },
    {
      id: 2,
      title: 'Neon Horizon: 2088',
      description: 'In a rain-soaked cyberpunk metropolis controlled by synthetic intelligence syndicates, an augmented detective uncovers an existential conspiracy linking corporate titans to human memory erasure.',
      release_year: 2025,
      genre: 'Sci-Fi',
      language: 'English',
      duration: '2h 14m',
      director: 'Denis Villeneuve',
      cast_members: 'Ryan Gosling, Ana de Armas, Harrison Ford, Sylvia Hoeks',
      poster_url: posters[1],
      backdrop_url: backdrops[1],
      trailer_url: 'https://www.youtube.com/watch?v=gCcx85zbxz4',
      featured: true,
      average_rating: 4.7,
      rating_count: 980,
    },
    {
      id: 3,
      title: 'The Kyoto Echo',
      description: 'An intimate drama unfolding in the historic alleyways of Kyoto, exploring three generations of traditional tea masters grappling with contemporary societal changes.',
      release_year: 2024,
      genre: 'Drama',
      language: 'Japanese',
      duration: '1h 56m',
      director: 'Hirokazu Kore-eda',
      cast_members: 'Koji Yakusho, Sakura Ando, Lily Franky, Mayu Matsuoka',
      poster_url: posters[2],
      backdrop_url: backdrops[2],
      trailer_url: 'https://www.youtube.com/watch?v=1F3hm6MfR1k',
      featured: false,
      average_rating: 4.9,
      rating_count: 730,
    },
    {
      id: 4,
      title: 'Shadows in the Mist',
      description: 'A veteran alpine search-and-rescue specialist investigates a string of inexplicable disappearances across the treacherous Pyrenees mountain range during a blizzard.',
      release_year: 2023,
      genre: 'Thriller',
      language: 'French',
      duration: '2h 08m',
      director: 'Justine Triet',
      cast_members: 'Sandra Hüller, Swann Arlaud, Milo Machado-Graner, Antoine Reinartz',
      poster_url: posters[3],
      backdrop_url: backdrops[3],
      trailer_url: 'https://www.youtube.com/watch?v=fTr7h7kQpB8',
      featured: false,
      average_rating: 4.4,
      rating_count: 512,
    },
    {
      id: 5,
      title: 'Chronicles of Eldoria',
      description: 'When ancient elemental seals shatter beneath the forgotten ruins of Eldoria, an exiled cartographer must unite fractured rival kingdoms before eternal darkness descends.',
      release_year: 2025,
      genre: 'Fantasy',
      language: 'English',
      duration: '2h 38m',
      director: 'Guillermo del Toro',
      cast_members: 'Dev Patel, Florence Pugh, Mads Mikkelsen, Cate Blanchett',
      poster_url: posters[4],
      backdrop_url: backdrops[4],
      trailer_url: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
      featured: true,
      average_rating: 4.6,
      rating_count: 890,
    },
    {
      id: 6,
      title: 'Midnight in Madrid',
      description: 'A whirlwind romance ignites between an art restorer on the run and an enigmatic flamenco guitarist as they navigate a high-stakes museum heist across Spain.',
      release_year: 2024,
      genre: 'Romance',
      language: 'Spanish',
      duration: '1h 48m',
      director: 'Pedro Almodóvar',
      cast_members: 'Penélope Cruz, Antonio Banderas, Javier Bardem, Blanca Suárez',
      poster_url: posters[5],
      backdrop_url: backdrops[5],
      trailer_url: 'https://www.youtube.com/watch?v=Yrz3B8hZ9Zk',
      featured: false,
      average_rating: 4.3,
      rating_count: 420,
    },
    {
      id: 7,
      title: 'Seoul Velocity',
      description: 'An elite undercover traffic investigator infiltrates the perilous underground electric street racing syndicate operating in the neon highways of futuristic Seoul.',
      release_year: 2025,
      genre: 'Action',
      language: 'Korean',
      duration: '2h 05m',
      director: 'Bong Joon-ho',
      cast_members: 'Song Kang-ho, Park So-dam, Choi Woo-shik, Lee Sun-kyun',
      poster_url: posters[6],
      backdrop_url: backdrops[6],
      trailer_url: 'https://www.youtube.com/watch?v=5xH0Hf13u5g',
      featured: false,
      average_rating: 4.6,
      rating_count: 670,
    },
    {
      id: 8,
      title: 'The Symphony of Silence',
      description: 'Based on an extraordinary true story of a visionary conductor who loses his hearing during the peak of the 1920s jazz revolution and invents a new sensory form of musical notation.',
      release_year: 2023,
      genre: 'Drama',
      language: 'English',
      duration: '2h 21m',
      director: 'Damien Chazelle',
      cast_members: 'Bradley Cooper, Carey Mulligan, Matt Bomer, Maya Hawke',
      poster_url: posters[7],
      backdrop_url: backdrops[7],
      trailer_url: 'https://www.youtube.com/watch?v=ga1m0456Vb4',
      featured: false,
      average_rating: 4.7,
      rating_count: 810,
    },
    {
      id: 9,
      title: 'Quantum Labyrinth',
      description: 'A rogue theoretical physicist discovers that every time she makes a conscious decision, her laboratory splits into divergent timelines that threaten to collapse the fabric of spacetime.',
      release_year: 2026,
      genre: 'Mystery',
      language: 'English',
      duration: '2h 17m',
      director: 'Alex Garland',
      cast_members: 'Natalie Portman, Oscar Isaac, Tessa Thompson, Jennifer Jason Leigh',
      poster_url: posters[8],
      backdrop_url: backdrops[8],
      trailer_url: 'https://www.youtube.com/watch?v=89OP78l9W1k',
      featured: false,
      average_rating: 4.5,
      rating_count: 390,
    },
    {
      id: 10,
      title: 'The Alpine Heist',
      description: 'A crew of international master lockpicks attempts an impossible extraction from an impenetrable vault carved into the heart of a Swiss glacier during an avalanche.',
      release_year: 2024,
      genre: 'Action',
      language: 'German',
      duration: '2h 02m',
      director: 'Edward Berger',
      cast_members: 'Daniel Brühl, Sebastian Koch, Paula Beer, Albrecht Schuch',
      poster_url: posters[9],
      backdrop_url: backdrops[9],
      trailer_url: 'https://www.youtube.com/watch?v=W6N8l293eX0',
      featured: false,
      average_rating: 4.4,
      rating_count: 480,
    },
    {
      id: 11,
      title: 'Whispers in the Stacks',
      description: 'In a sprawling Victorian archive, a meticulous conservator discovers encoded watermarks in rare medieval manuscripts that foretell historic global cataclysms.',
      release_year: 2023,
      genre: 'Mystery',
      language: 'English',
      duration: '1h 58m',
      director: 'Kenneth Branagh',
      cast_members: 'Kenneth Branagh, Emma Thompson, Colin Firth, Judi Dench',
      poster_url: posters[10],
      backdrop_url: backdrops[10],
      trailer_url: 'https://www.youtube.com/watch?v=qM79_itR0Nc',
      featured: false,
      average_rating: 4.2,
      rating_count: 340,
    },
    {
      id: 12,
      title: 'The Last Canopy',
      description: 'A courageous botanical expedition deep in the uncharted Amazon basin uncovers a sentient bioluminescent biome that holds the cure to a worldwide atmospheric degradation.',
      release_year: 2025,
      genre: 'Adventure',
      language: 'Spanish',
      duration: '2h 11m',
      director: 'Alejandro G. Iñárritu',
      cast_members: 'Gael García Bernal, Salma Hayek, Diego Luna, Wagner Moura',
      poster_url: posters[11],
      backdrop_url: backdrops[11],
      trailer_url: 'https://www.youtube.com/watch?v=73_1biulkYk',
      featured: false,
      average_rating: 4.5,
      rating_count: 560,
    },
  ];

  for (const m of handcrafted) {
    movies.push(m);
    usedTitles.add(m.title);
  }

  let nextId = 13;
  let adjIndex = 0;
  let nounIndex = 0;

  // Generate up to 1,020 movies
  while (movies.length < 1020) {
    const adj = adjectives[adjIndex % adjectives.length];
    const noun = nouns[nounIndex % nouns.length];
    const variation = Math.floor(movies.length / (adjectives.length * nouns.length));

    let title = '';
    const pattern = (movies.length + variation) % 6;
    if (pattern === 0) {
      title = `The ${adj} ${noun}`;
    } else if (pattern === 1) {
      title = `${adj} ${noun}`;
    } else if (pattern === 2) {
      title = `${noun} of the ${adj}`;
    } else if (pattern === 3) {
      title = `Beyond the ${adj} ${noun}`;
    } else if (pattern === 4) {
      title = `${adj} ${noun}: Part ${((movies.length % 3) + 1)}`;
    } else {
      title = `${noun}: ${adj} Reign`;
    }

    if (variation > 0) {
      title += ` (Chapter ${variation + 1})`;
    }

    adjIndex++;
    if (adjIndex % adjectives.length === 0) {
      nounIndex++;
    }

    if (usedTitles.has(title)) {
      title += ` ${nextId}`;
    }
    usedTitles.add(title);

    const genre = genres[nextId % genres.length];
    const language = languages[nextId % languages.length];
    const director = directors[nextId % directors.length];

    // Pick 3-4 cast members
    const c1 = castPool[nextId % castPool.length];
    const c2 = castPool[(nextId + 3) % castPool.length];
    const c3 = castPool[(nextId + 7) % castPool.length];
    const cast = `${c1}, ${c2}, ${c3}`;

    // Release year between 1970 and 2026
    const yearBase = 1970 + ((nextId * 7) % 57);
    const release_year = Math.min(2026, Math.max(1975, yearBase));

    // Runtime between 1h 35m and 2h 55m
    const hours = 1 + ((nextId % 2) === 1 ? 1 : 0);
    const mins = 15 + ((nextId * 13) % 45);
    const duration = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    const poster = posters[nextId % posters.length];
    const backdrop = backdrops[nextId % backdrops.length];
    const storyTemplate = storylineTemplates[nextId % storylineTemplates.length];
    const desc = `${title} is a ${genre.toLowerCase()} tour-de-force set in ${release_year}. ${storyTemplate}`;

    // Rating between 3.6 and 4.9
    const avgRating = Number((3.6 + ((nextId * 17) % 14) / 10).toFixed(1));
    const ratingCount = 80 + ((nextId * 53) % 1800);

    movies.push({
      id: nextId,
      title,
      description: desc,
      release_year,
      genre,
      language,
      duration,
      director,
      cast_members: cast,
      poster_url: poster,
      backdrop_url: backdrop,
      trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      featured: (nextId % 40 === 0),
      average_rating: avgRating,
      rating_count: ratingCount,
    });

    nextId++;
  }

  return movies;
}

// Generate and write file
const allMovies = generate1000Movies();
console.log(`Generated ${allMovies.length} movies!`);

const outputData = `// Auto-generated 1,000+ CineRate catalog dataset
export interface MovieSeed {
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
  average_rating: number;
  rating_count: number;
}

export const MOVIES_DATASET: MovieSeed[] = ${JSON.stringify(allMovies, null, 2)};
`;

fs.mkdirSync(path.resolve('./src/data'), { recursive: true });
fs.writeFileSync(path.resolve('./src/data/moviesData.ts'), outputData);
console.log('Saved to src/data/moviesData.ts');
