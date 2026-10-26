const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
  },
};

export const fetchMovies = ({ query }: { query: string }): Promise<any[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;


  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", endpoint);
    
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("Authorization", TMDB_CONFIG.headers.Authorization);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const results = Array.isArray(data?.results) ? data.results : [];
          resolve(results);
        } catch (e) {
          console.error("❌ Failed to parse JSON", e);
          resolve([]);
        }
      } else {
        console.error(`❌ XHR Error: Status ${xhr.status}`);
        resolve([]);
      }
    };

    xhr.onerror = () => {
      console.error("❌ XHR Network Error");
      resolve([]);
    };

    xhr.send();
  });
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
