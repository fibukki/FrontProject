import { showMovieModal } from './movie-modal.js';

export const MovieList = (movies) => {
    const movieGrid = document.querySelector('#movie-grid');
    movieGrid.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-card__title">${movie.title}</div>
        `;
        movieCard.addEventListener('click', () => showMovieModal(movie));

        movieGrid.appendChild(movieCard);
    });
};
