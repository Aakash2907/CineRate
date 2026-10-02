const fs = require('fs');
const path = require('path');
const { famousMovies } = require('./dataset_famous.cjs');
const { tamilMovies } = require('./dataset_tamil.cjs');
const { indianMovies } = require('./dataset_indian.cjs');

const posterPool = [
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800&auto=format&fit=crop"
];

const backdropPool = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop"
];

const trailers = [
  "https://www.youtube.com/watch?v=qtRKdVHc-cE",
  "https://www.youtube.com/watch?v=uYPbbksJxIg",
  "https://www.youtube.com/watch?v=oR_e9y-bka0",
  "https://www.youtube.com/watch?v=EXeTwQWrcwY",
  "https://www.youtube.com/watch?v=YoHD9XEInc0",
  "https://www.youtube.com/watch?v=zSWdZVtXT7E",
  "https://www.youtube.com/watch?v=PLl99DlL6b4",
  "https://www.youtube.com/watch?v=Way9Dexny3w",
  "https://www.youtube.com/watch?v=5xH0Hf13u5g"
];

const allMovies = [];
let nextId = 1;

// 1. Add famous classics
for (const item of famousMovies) {
  allMovies.push({
    id: nextId++,
    title: item[0],
    release_year: item[1],
    genre: item[2],
    language: item[3],
    duration: item[4],
    director: item[5],
    cast_members: item[6],
    description: item[7],
    poster_url: item[8],
    backdrop_url: item[9],
    trailer_url: item[10],
    featured: true,
    average_rating: item[11],
    rating_count: item[12]
  });
}

// 2. Add 105+ Tamil movies
for (const item of tamilMovies) {
  const pIdx = (nextId * 3) % posterPool.length;
  const bIdx = (nextId * 5) % backdropPool.length;
  const tIdx = nextId % trailers.length;
  allMovies.push({
    id: nextId++,
    title: item[0],
    release_year: item[1],
    genre: item[2],
    language: item[3],
    duration: item[4],
    director: item[5],
    cast_members: item[6],
    description: item[7],
    poster_url: posterPool[pIdx],
    backdrop_url: backdropPool[bIdx],
    trailer_url: trailers[tIdx],
    featured: (item[1] >= 2022 || item[8] >= 4.9),
    average_rating: item[8],
    rating_count: item[9]
  });
}

// 3. Add famous Indian movies (Hindi, Telugu, Malayalam, Kannada)
for (const item of indianMovies) {
  const pIdx = (nextId * 7) % posterPool.length;
  const bIdx = (nextId * 2) % backdropPool.length;
  const tIdx = nextId % trailers.length;
  allMovies.push({
    id: nextId++,
    title: item[0],
    release_year: item[1],
    genre: item[2],
    language: item[3],
    duration: item[4],
    director: item[5],
    cast_members: item[6],
    description: item[7],
    poster_url: posterPool[pIdx],
    backdrop_url: backdropPool[bIdx],
    trailer_url: trailers[tIdx],
    featured: (item[1] >= 2021 || item[8] >= 4.9),
    average_rating: item[8],
    rating_count: item[9]
  });
}

// 4. Curated World Cinema & Cinema Classics
const worldCinema = [
  ["The Godfather: Part II", 1974, "Crime", "English", "3h 22m", "Francis Ford Coppola", "Al Pacino, Robert De Niro, Robert Duvall", "The early life and career of Vito Corleone in 1920s New York City is portrayed while his son Michael expands the crime syndicate."],
  ["The Lord of the Rings: The Fellowship of the Ring", 2001, "Fantasy", "English", "2h 58m", "Peter Jackson", "Elijah Wood, Ian McKellen, Viggo Mortensen", "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring."],
  ["The Lord of the Rings: The Two Towers", 2002, "Fantasy", "English", "2h 59m", "Peter Jackson", "Elijah Wood, Ian McKellen, Viggo Mortensen", "While Frodo and Sam edge closer to Mordor with the help of Gollum, the divided fellowship makes a stand at Helm's Deep."],
  ["The Lord of the Rings: The Return of the King", 2003, "Fantasy", "English", "3h 21m", "Peter Jackson", "Elijah Wood, Ian McKellen, Viggo Mortensen", "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam approaching Mount Doom."],
  ["Casablanca", 1942, "Romance", "English", "1h 42m", "Michael Curtiz", "Humphrey Bogart, Ingrid Bergman, Paul Henreid", "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband."],
  ["Psycho", 1960, "Horror", "English", "1h 49m", "Alfred Hitchcock", "Anthony Perkins, Janet Leigh, Vera Miles", "A Phoenix secretary on the run checks into a secluded motel run by a polite but deeply disturbed young man."],
  ["The Shining", 1980, "Horror", "English", "2h 26m", "Stanley Kubrick", "Jack Nicholson, Shelley Duvall, Danny Lloyd", "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violent insanity."],
  ["Alien", 1979, "Sci-Fi", "English", "1h 57m", "Ridley Scott", "Sigourney Weaver, Tom Skerritt, John Hurt", "The crew of a commercial spacecraft encounters a deadly lifeform after investigating an unknown transmission on an alien planet."],
  ["Aliens", 1986, "Action", "English", "2h 17m", "James Cameron", "Sigourney Weaver, Michael Biehn, Carrie Henn", "Fifty-seven years after surviving her first ordeal, Ellen Ripley returns to the planetoid accompanied by colonial marines."],
  ["Terminator 2: Judgment Day", 1991, "Action", "English", "2h 17m", "James Cameron", "Arnold Schwarzenegger, Linda Hamilton, Edward Furlong", "A reprogrammed cyborg is sent back in time to protect ten-year-old John Connor from an advanced shape-shifting assassin."],
  ["Jurassic Park", 1993, "Adventure", "English", "2h 07m", "Steven Spielberg", "Sam Neill, Laura Dern, Jeff Goldblum", "An industrialist invites scientists to tour his secret island theme park featuring cloned dinosaurs, where security collapses."],
  ["Back to the Future", 1985, "Sci-Fi", "English", "1h 56m", "Robert Zemeckis", "Michael J. Fox, Christopher Lloyd, Lea Thompson", "Marty McFly is accidentally sent thirty years into the past in a time-traveling DeLorean invented by Doc Brown."],
  ["Amélie", 2001, "Romance", "French", "2h 02m", "Jean-Pierre Jeunet", "Audrey Tautou, Mathieu Kassovitz, Rufus", "An imaginative Parisian waitress decides to orchestrate discreet acts of kindness to enrich the lives of people around her."],
  ["City of God", 2002, "Crime", "Spanish", "2h 10m", "Fernando Meirelles", "Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen", "In the slums of Rio de Janeiro, two boys take separate paths: one strives to become a photographer, the other a drug lord."],
  ["Pan's Labyrinth", 2006, "Fantasy", "Spanish", "1h 58m", "Guillermo del Toro", "Ivana Baquero, Sergi López, Maribel Verdú", "In post-Civil War Spain, a lonely girl enters a labyrinth where a mysterious faun sets her three mythical trials."],
  ["Oldboy", 2003, "Action", "Korean", "2h 00m", "Park Chan-wook", "Choi Min-sik, Yoo Ji-tae, Kang Hye-jung", "After being kidnapped and imprisoned for fifteen years for unknown reasons, a desperate man is given five days to find his captor."],
  ["Memories of Murder", 2003, "Crime", "Korean", "2h 11m", "Bong Joon-ho", "Song Kang-ho, Kim Sang-kyung, Roe-ha Kim", "In 1986 rural South Korea, two mismatched detectives investigate the country's first recorded serial murders."],
  ["Train to Busan", 2016, "Horror", "Korean", "1h 58m", "Yeon Sang-ho", "Gong Yoo, Jung Yu-mi, Ma Dong-seok", "Passengers on a high-speed bullet train from Seoul to Busan battle to survive an outbreak of rapid viral zombies."],
  ["Cinema Paradiso", 1988, "Drama", "Italian", "2h 35m", "Giuseppe Tornatore", "Philippe Noiret, Salvatore Cascio, Jacques Perrin", "A celebrated filmmaker recalls his childhood friendship with the projectionist at his village cinema in post-war Sicily."],
  ["Life is Beautiful", 1997, "Drama", "Italian", "1h 56m", "Roberto Benigni", "Roberto Benigni, Nicoletta Braschi, Giorgio Cantarini", "A Jewish Italian father uses humor and playful imagination to shield his son from the grim horrors of a concentration camp."],
  ["The Intouchables", 2011, "Comedy", "French", "1h 52m", "Olivier Nakache, Éric Toledano", "François Cluzet, Omar Sy, Anne Le Ny", "An aristocrat quadriplegic hires a charismatic young ex-convict from the suburbs to be his live-in caregiver."],
  ["Anatomy of a Fall", 2023, "Mystery", "French", "2h 31m", "Justine Triet", "Sandra Hüller, Swann Arlaud, Milo Machado-Graner", "A woman is put on trial for murder after her husband's fatal fall from their remote alpine chalet."],
  ["Past Lives", 2023, "Romance", "Korean", "1h 46m", "Celine Song", "Greta Lee, Teo Yoo, John Magaro", "Two deeply connected childhood sweethearts in Seoul are reunited for one fateful week in New York twenty-four years later."],
  ["The Zone of Interest", 2023, "Drama", "German", "1h 45m", "Jonathan Glazer", "Christian Friedel, Sandra Hüller, Johann Karthaus", "Auschwitz commandant Rudolf Höss and his wife strive to build an idyllic domestic dream life in a house adjoining the camp."],
  ["Poor Things", 2023, "Fantasy", "English", "2h 21m", "Yorgos Lanthimos", "Emma Stone, Mark Ruffalo, Willem Dafoe", "The incredible tale of Bella Baxter, a young woman brought back to life by an unorthodox scientist, who sets out to explore the world."]
];

for (const item of worldCinema) {
  const pIdx = (nextId * 11) % posterPool.length;
  const bIdx = (nextId * 4) % backdropPool.length;
  const tIdx = nextId % trailers.length;
  allMovies.push({
    id: nextId++,
    title: item[0],
    release_year: item[1],
    genre: item[2],
    language: item[3],
    duration: item[4],
    director: item[5],
    cast_members: item[6],
    description: item[7],
    poster_url: posterPool[pIdx],
    backdrop_url: backdropPool[bIdx],
    trailer_url: trailers[tIdx],
    featured: (item[1] >= 2023),
    average_rating: 4.8,
    rating_count: 3200 + ((nextId * 13) % 1500)
  });
}

// 5. Expand catalog up to 1050+ with diverse genre titles across all categories
const genres = ["Action", "Sci-Fi", "Drama", "Thriller", "Comedy", "Romance", "Crime", "Mystery", "Adventure", "Fantasy", "Animation", "Biography", "Horror"];
const languages = ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Japanese", "Korean", "French", "Spanish", "German"];

const directors = [
  "Christopher Nolan", "David Fincher", "Denis Villeneuve", "Mani Ratnam", "Lokesh Kanagaraj",
  "S. S. Rajamouli", "Martin Scorsese", "Quentin Tarantino", "Bong Joon-ho", "Vetrimaaran",
  "Mari Selvaraj", "Hayao Miyazaki", "Ridley Scott", "Steven Spielberg", "Guillermo del Toro",
  "Alfonso Cuarón", "Wes Anderson", "Damien Chazelle", "Karthik Subbaraj", "Nelson",
  "Pa. Ranjith", "S. Shankar", "Gautham Vasudev Menon", "Anurag Kashyap", "Jeethu Joseph"
];

const castClusters = [
  "Brad Pitt, Edward Norton, Cate Blanchett",
  "Thalapathy Vijay, Trisha, Sanjay Dutt",
  "Kamal Haasan, Vijay Sethupathi, Fahadh Faasil",
  "Rajinikanth, Amitabh Bachchan, Mohanlal",
  "Dhanush, Sai Pallavi, Prakash Raj",
  "Suriya, Anushka Shetty, Vikram",
  "Leonardo DiCaprio, Cillian Murphy, Florence Pugh",
  "Shah Rukh Khan, Deepika Padukone, Manoj Bajpayee",
  "Prabhas, Rana Daggubati, Ram Charan",
  "Christian Bale, Ryan Gosling, Emma Stone",
  "Song Kang-ho, Choi Woo-shik, Park So-dam",
  "Koji Yakusho, Sakura Ando, Lily Franky"
];

const adjectives = [
  "Silent", "Crimson", "Shadow", "Infinite", "Midnight", "Golden", "Frozen", "Electric",
  "Hidden", "Secret", "Cosmic", "Lost", "Final", "Eternal", "Rogue", "Sovereign",
  "Neon", "Silver", "Phantom", "Dark", "Radiant", "Solar", "Iron", "Echoing"
];

const nouns = [
  "Horizon", "Whisper", "Odyssey", "Labyrinth", "Chronicle", "Legacy", "Symphony",
  "Protocol", "Paradox", "Frontier", "Sanctuary", "Empire", "Dynasty", "Resonance",
  "Convergence", "Mirage", "Voyage", "Reckoning", "Enigma", "Ascent", "Eclipse", "Vanguard"
];

while (allMovies.length < 1050) {
  const adj = adjectives[allMovies.length % adjectives.length];
  const noun = nouns[Math.floor(allMovies.length / adjectives.length) % nouns.length];
  const iter = Math.floor(allMovies.length / (adjectives.length * nouns.length)) + 1;
  const title = iter === 1 ? `${adj} ${noun}` : `${adj} ${noun}: Chapter ${iter}`;
  
  const g = genres[allMovies.length % genres.length];
  const lang = languages[allMovies.length % languages.length];
  const year = 1990 + (allMovies.length % 36); // 1990 to 2025
  const dir = directors[allMovies.length % directors.length];
  const cast = castClusters[allMovies.length % castClusters.length];
  const pIdx = (allMovies.length * 3) % posterPool.length;
  const bIdx = (allMovies.length * 7) % backdropPool.length;
  const tIdx = allMovies.length % trailers.length;
  const durH = 1 + (allMovies.length % 2);
  const durM = 30 + ((allMovies.length * 7) % 30);
  const rating = Number((3.8 + ((allMovies.length * 17) % 12) * 0.1).toFixed(1));
  const rCount = 200 + ((allMovies.length * 37) % 2500);

  allMovies.push({
    id: nextId++,
    title,
    release_year: year,
    genre: g,
    language: lang,
    duration: `${durH}h ${durM}m`,
    director: dir,
    cast_members: cast,
    description: `${title} is an acclaimed ${g.toLowerCase()} masterwork directed by ${dir}. A compelling cinematic journey examining resilience, destiny, and the human spirit.`,
    poster_url: posterPool[pIdx],
    backdrop_url: backdropPool[bIdx],
    trailer_url: trailers[tIdx],
    featured: (allMovies.length % 25 === 0),
    average_rating: rating,
    rating_count: rCount
  });
}

console.log(`Successfully generated ${allMovies.length} movies!`);
const tamilCount = allMovies.filter(m => m.language === 'Tamil').length;
const hindiCount = allMovies.filter(m => m.language === 'Hindi').length;
const teluguCount = allMovies.filter(m => m.language === 'Telugu').length;
const malayalamCount = allMovies.filter(m => m.language === 'Malayalam').length;
console.log(`Tamil: ${tamilCount}, Hindi: ${hindiCount}, Telugu: ${teluguCount}, Malayalam: ${malayalamCount}`);

// Write to src/data/moviesData.ts
const fileHeader = `// CineRate Catalog Dataset (${allMovies.length} movies)
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

fs.writeFileSync(path.resolve(__dirname, '../src/data/moviesData.ts'), fileHeader, 'utf8');
console.log('src/data/moviesData.ts updated successfully!');
