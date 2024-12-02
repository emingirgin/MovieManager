export const TMDB_GENRES = {
  28: 'ACTION',
  12: 'ADVENTURE',
  16: 'ANIMATION',
  35: 'COMEDY',
  80: 'CRIME',
  99: 'DOCUMENTARY',
  18: 'DRAMA',
  10751: 'FAMILY',
  14: 'FANTASY',
  36: 'HISTORY',
  27: 'HORROR',
  10402: 'MUSIC',
  9648: 'MYSTERY',
  10749: 'ROMANCE',
  878: 'SCIENCE_FICTION',
  53: 'THRILLER',
  10752: 'WAR',
  37: 'WESTERN'
};

export const mapTMDBGenre = (genreId) => {
  return TMDB_GENRES[genreId] || 'DRAMA'; // Default to DRAMA if genre not found
}; 