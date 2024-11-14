document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        watchlistGrid: document.querySelector('#watchlist-grid'),
    };

    const getWatchlist = () => {
        return JSON.parse(localStorage.getItem('watchlist')) || [];
    };

    const displayWatchlist = () => {
        const watchlist = getWatchlist();
        elements.watchlistGrid.innerHTML = '';

        watchlist.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-card__title">${movie.title}</div>
            `;
            elements.watchlistGrid.appendChild(movieCard);
        });
    };


    displayWatchlist();
});
