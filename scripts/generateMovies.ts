import fs from 'fs';
import path from 'path';

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

// Iconic famous films requested by user
const famousMasterpieces: Omit<MovieSeed, 'id'>[] = [
  {
    title: 'Fight Club',
    description: 'An insomniac office worker and an enigmatic, anarchic soap salesman build a clandestine underground fight club that rapidly metastasizes into an unexpected, radical anti-consumerist revolution.',
    release_year: 1999,
    genre: 'Drama',
    language: 'English',
    duration: '2h 19m',
    director: 'David Fincher',
    cast_members: 'Brad Pitt, Edward Norton, Helena Bonham Carter, Meat Loaf, Jared Leto',
    poster_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=qtRKdVHc-cE',
    featured: true,
    average_rating: 4.9,
    rating_count: 3200,
  },
  {
    title: 'Oppenheimer',
    description: 'The sweeping, intimate chronicle of J. Robert Oppenheimer, the brilliant theoretical physicist who led the Manhattan Project to invent the atomic bomb, and the moral fallout that reshaped humanity.',
    release_year: 2023,
    genre: 'Drama',
    language: 'English',
    duration: '3h 00m',
    director: 'Christopher Nolan',
    cast_members: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr., Florence Pugh',
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    featured: true,
    average_rating: 4.9,
    rating_count: 2950,
  },
  {
    title: '2001: A Space Odyssey',
    description: 'An awe-inspiring masterpiece exploring human evolution, alien monoliths, and a voyage to Jupiter governed by HAL 9000, an increasingly erratic sentient supercomputer.',
    release_year: 1968,
    genre: 'Sci-Fi',
    language: 'English',
    duration: '2h 29m',
    director: 'Stanley Kubrick',
    cast_members: 'Keir Dullea, Gary Lockwood, William Sylvester, Douglas Rain',
    poster_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=oR_e9y-bka0',
    featured: true,
    average_rating: 4.8,
    rating_count: 2600,
  },
  {
    title: 'Interstellar',
    description: 'When Earth faces atmospheric collapse, a courageous team of astronauts embarks through a wormhole near Saturn in search of a new home for the human species.',
    release_year: 2014,
    genre: 'Sci-Fi',
    language: 'English',
    duration: '2h 49m',
    director: 'Christopher Nolan',
    cast_members: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine, Timothée Chalamet',
    poster_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    featured: true,
    average_rating: 4.9,
    rating_count: 3400,
  },
  {
    title: 'Inception',
    description: 'A skilled thief who steals corporate secrets through dream-sharing technology is offered an impossible task: plant an original idea into the subconscious mind of a CEO heir.',
    release_year: 2010,
    genre: 'Sci-Fi',
    language: 'English',
    duration: '2h 28m',
    director: 'Christopher Nolan',
    cast_members: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy, Ken Watanabe',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    featured: true,
    average_rating: 4.9,
    rating_count: 3100,
  },
  {
    title: 'The Dark Knight',
    description: 'When the menacing Joker emerges to plunge Gotham into chaos and anarchy, Batman must confront one of the greatest psychological and physical challenges of his life.',
    release_year: 2008,
    genre: 'Action',
    language: 'English',
    duration: '2h 32m',
    director: 'Christopher Nolan',
    cast_members: 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine, Maggie Gyllenhaal',
    poster_url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    featured: true,
    average_rating: 5.0,
    rating_count: 3800,
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two Los Angeles mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    release_year: 1994,
    genre: 'Crime',
    language: 'English',
    duration: '2h 34m',
    director: 'Quentin Tarantino',
    cast_members: 'John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis, Ving Rhames',
    poster_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    featured: true,
    average_rating: 4.9,
    rating_count: 2900,
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Over the course of several decades, two imprisoned men find solace and eventual redemption through acts of common decency and quiet resilience.',
    release_year: 1994,
    genre: 'Drama',
    language: 'English',
    duration: '2h 22m',
    director: 'Frank Darabont',
    cast_members: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler, Clancy Brown',
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    featured: true,
    average_rating: 5.0,
    rating_count: 4200,
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.',
    release_year: 1972,
    genre: 'Crime',
    language: 'English',
    duration: '2h 55m',
    director: 'Francis Ford Coppola',
    cast_members: 'Marlon Brando, Al Pacino, James Caan, Robert Duvall, Diane Keaton',
    poster_url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=sY1S34973zA',
    featured: true,
    average_rating: 5.0,
    rating_count: 3600,
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    release_year: 2019,
    genre: 'Thriller',
    language: 'Korean',
    duration: '2h 12m',
    director: 'Bong Joon-ho',
    cast_members: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik, Park So-dam',
    poster_url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=5xH0Hf13u5g',
    featured: true,
    average_rating: 4.9,
    rating_count: 2700,
  },
  {
    title: 'The Matrix',
    description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth: his life is an elaborate deception of an evil cyber-intelligence.',
    release_year: 1999,
    genre: 'Sci-Fi',
    language: 'English',
    duration: '2h 16m',
    director: 'Lana & Lilly Wachowski',
    cast_members: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Joe Pantoliano',
    poster_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    featured: true,
    average_rating: 4.8,
    rating_count: 3100,
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family in an epic galactic uprising.',
    release_year: 2024,
    genre: 'Sci-Fi',
    language: 'English',
    duration: '2h 46m',
    director: 'Denis Villeneuve',
    cast_members: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    featured: true,
    average_rating: 4.9,
    rating_count: 2400,
  },
  {
    title: 'Whiplash',
    description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student potential.',
    release_year: 2014,
    genre: 'Drama',
    language: 'English',
    duration: '1h 46m',
    director: 'Damien Chazelle',
    cast_members: 'Miles Teller, J.K. Simmons, Paul Reiser, Melissa Benoist',
    poster_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=7d_jQycdQGo',
    featured: false,
    average_rating: 4.8,
    rating_count: 2100,
  },
  {
    title: 'Blade Runner 2049',
    description: 'Young Blade Runner K discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who has been missing for thirty years.',
    release_year: 2017,
    genre: 'Sci-Fi',
    language: 'English',
    duration: '2h 44m',
    director: 'Denis Villeneuve',
    cast_members: 'Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks, Robin Wright',
    poster_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=gCcx85zbxz4',
    featured: true,
    average_rating: 4.8,
    rating_count: 2300,
  },
  {
    title: 'Gladiator',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    release_year: 2000,
    genre: 'Action',
    language: 'English',
    duration: '2h 35m',
    director: 'Ridley Scott',
    cast_members: 'Russell Crowe, Joaquin Phoenix, Connie Nielsen, Oliver Reed, Richard Harris',
    poster_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=owK1qxDselE',
    featured: true,
    average_rating: 4.8,
    rating_count: 2500,
  },
  {
    title: 'Se7en',
    description: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
    release_year: 1995,
    genre: 'Crime',
    language: 'English',
    duration: '2h 07m',
    director: 'David Fincher',
    cast_members: 'Brad Pitt, Morgan Freeman, Gwyneth Paltrow, Kevin Spacey',
    poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=znmZoVkCjpI',
    featured: false,
    average_rating: 4.8,
    rating_count: 2200,
  },
  {
    title: 'Forrest Gump',
    description: 'The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.',
    release_year: 1994,
    genre: 'Drama',
    language: 'English',
    duration: '2h 22m',
    director: 'Robert Zemeckis',
    cast_members: 'Tom Hanks, Robin Wright, Gary Sinise, Sally Field',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
    featured: false,
    average_rating: 4.8,
    rating_count: 2800,
  },
  {
    title: 'Goodfellas',
    description: 'The story of Henry Hill and his life in the mafia, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito.',
    release_year: 1990,
    genre: 'Crime',
    language: 'English',
    duration: '2h 25m',
    director: 'Martin Scorsese',
    cast_members: 'Robert De Niro, Ray Liotta, Joe Pesci, Lorraine Bracco, Paul Sorvino',
    poster_url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=2ilzidi_J8Q',
    featured: false,
    average_rating: 4.8,
    rating_count: 2100,
  },
  {
    title: 'Spirited Away',
    description: 'During her family move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.',
    release_year: 2001,
    genre: 'Animation',
    language: 'Japanese',
    duration: '2h 05m',
    director: 'Hayao Miyazaki',
    cast_members: 'Rumi Hiiragi, Miyu Irino, Mari Natsuki, Takashi Naito',
    poster_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    featured: true,
    average_rating: 4.9,
    rating_count: 2600,
  },
  {
    title: 'The Silence of the Lambs',
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
    release_year: 1991,
    genre: 'Thriller',
    language: 'English',
    duration: '1h 58m',
    director: 'Jonathan Demme',
    cast_members: 'Jodie Foster, Anthony Hopkins, Lawrence A. Bonney, Kasi Lemmons',
    poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=W6Mm8Sbe__o',
    featured: false,
    average_rating: 4.8,
    rating_count: 2200,
  },
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

  let idCounter = 1;

  // Add all famous masterpieces first
  for (const m of famousMasterpieces) {
    movies.push({
      ...m,
      id: idCounter++,
    });
    usedTitles.add(m.title.toLowerCase());
  }

  let adjIndex = 0;
  let nounIndex = 0;

  // Generate up to 1,025 movies
  while (movies.length < 1025) {
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

    if (usedTitles.has(title.toLowerCase())) {
      title += ` ${idCounter}`;
    }
    usedTitles.add(title.toLowerCase());

    const genre = genres[idCounter % genres.length];
    const language = languages[idCounter % languages.length];
    const director = directors[idCounter % directors.length];

    const c1 = castPool[idCounter % castPool.length];
    const c2 = castPool[(idCounter + 3) % castPool.length];
    const c3 = castPool[(idCounter + 7) % castPool.length];
    const cast = `${c1}, ${c2}, ${c3}`;

    const yearBase = 1970 + ((idCounter * 7) % 57);
    const release_year = Math.min(2026, Math.max(1975, yearBase));

    const hours = 1 + ((idCounter % 2) === 1 ? 1 : 0);
    const mins = 15 + ((idCounter * 13) % 45);
    const duration = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    const poster = posters[idCounter % posters.length];
    const backdrop = backdrops[idCounter % backdrops.length];
    const storyTemplate = storylineTemplates[idCounter % storylineTemplates.length];
    const desc = `${title} is a ${genre.toLowerCase()} tour-de-force set in ${release_year}. ${storyTemplate}`;

    const avgRating = Number((3.6 + ((idCounter * 17) % 14) / 10).toFixed(1));
    const ratingCount = 80 + ((idCounter * 53) % 1800);

    movies.push({
      id: idCounter,
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
      featured: (idCounter % 40 === 0),
      average_rating: avgRating,
      rating_count: ratingCount,
    });

    idCounter++;
  }

  return movies;
}

// Generate and write file
const allMovies = generate1000Movies();
console.log(`Generated ${allMovies.length} movies with famous masterpieces!`);

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
