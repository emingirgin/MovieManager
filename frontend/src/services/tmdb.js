export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getTMDBMovieDetails = async (title, year) => {
  try {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    
    // First try with exact title and year
    let searchResponse = await fetch(
      `${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&year=${year}&language=en-US`
    );
    
    let searchData = await searchResponse.json();
    
    // If no exact match, try with just the title
    if (!searchData.results?.length) {
      searchResponse = await fetch(
        `${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&language=en-US`
      );
      searchData = await searchResponse.json();
    }
    
    if (!searchData.results?.length) {
      console.log('No results found for', title);
      return null;
    }

    // Find the best match by comparing titles and years
    const bestMatch = searchData.results.find(movie => {
      const movieYear = new Date(movie.release_date).getFullYear();
      return movie.title.toLowerCase() === title.toLowerCase() && movieYear === year;
    }) || searchData.results[0];

    // Get detailed movie info including official videos and images
    const movieId = bestMatch.id;
    const detailsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos,images&language=en-US&include_image_language=en,null`
    );
    
    if (!detailsResponse.ok) {
      console.error('TMDb API Error:', await detailsResponse.json());
      return null;
    }
    
    const details = await detailsResponse.json();

    // Filter for official trailers and teasers only, limit to top 3
    if (details.videos?.results) {
      details.videos.results = details.videos.results
        .filter(video => 
          video.site === 'YouTube' && 
          ['Trailer', 'Teaser'].includes(video.type) &&
          video.official
        )
        .sort((a, b) => {
          // Prioritize trailers over teasers
          if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
          if (a.type !== 'Trailer' && b.type === 'Trailer') return 1;
          // Then sort by publish date (newest first)
          return new Date(b.published_at) - new Date(a.published_at);
        })
        .slice(0, 3); // Limit to top 3 videos
    }

    // Filter and sort images, limit to top 8
    if (details.images?.backdrops) {
      details.images.backdrops = details.images.backdrops
        .filter(image => 
          image.width >= 1280 && // Only HD images
          image.vote_average > 0 // Only voted images
        )
        .sort((a, b) => b.vote_average - a.vote_average) // Sort by rating
        .slice(0, 8); // Limit to top 8 images
    }

    return details;
  } catch (error) {
    console.error('Error fetching TMDB data:', error);
    return null;
  }
};

export const getImageUrl = (path, size = 'original') => {
  if (!path) {
    console.log('No image path provided, using placeholder'); // Debug log
    return '/placeholder-movie.jpg';
  }
  const url = `${IMAGE_BASE_URL}/${size}${path}`;
  console.log('Generated image URL:', url); // Debug log
  return url;
};

export const getNewReleases = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('TMDb API Error:', errorData);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return null;
  }
};

export const getMovieExternalIds = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/external_ids?api_key=${TMDB_API_KEY}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.imdb_id;
  } catch (error) {
    console.error('Error fetching external IDs:', error);
    return null;
  }
}; 