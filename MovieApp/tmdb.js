const API_KEY = '9cffa19eb618a53678cd77c3faeeb3c3';
const BASE_URL = 'https://api.themoviedb.org/3';


const fetchWithErrorHandling = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};


export const getAllMoviesByPage = async (page = 1, sortOption = 'popularity.desc') => {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortOption}&page=${page}`;
    return await fetchWithErrorHandling(url);
};


export const searchMovies = async (query, page = 1) => {
    if (!query.trim()) return [];
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
    return await fetchWithErrorHandling(url);
};


export const getMovieDetails = async (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    return await fetchWithErrorHandling(url);
};


export const getMovieReviews = async (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`;
    return await fetchWithErrorHandling(url);
};


export const getMovieTrailer = async (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
    return await fetchWithErrorHandling(url);
};

export const getMovieCastCrew = async (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
    return await fetchWithErrorHandling(url);
};
