import { getMovieReviews, getMovieTrailer, getMovieCastCrew } from './tmdb.js';

export const showMovieModal = async (movie) => {
    const movieModal = document.querySelector('#movie-modal');
    const modalTitle = document.querySelector('#movie-title');
    const modalSynopsis = document.querySelector('#movie-synopsis');
    const modalRatingRuntime = document.querySelector('#movie-rating-runtime');
    const modalRelease = document.querySelector('#movie-release');
    const modalOverview = document.querySelector('#movie-overview');
    const modalCastCrew = document.querySelector('#movie-cast-crew');
    const modalReviews = document.querySelector('#movie-reviews');
    const modalTrailer = document.querySelector('#movie-trailer');
    const closeModalButton = document.querySelector('#close-modal');
    const addToWatchlistButton = document.querySelector('#add-to-watchlist');

    modalTitle.textContent = movie.title || 'No title available';
    modalSynopsis.textContent = movie.synopsis || 'No synopsis available';
    modalRatingRuntime.textContent = `Rating: ${movie.vote_average || 'N/A'} | Runtime: ${movie.runtime || 'N/A'} min`;
    modalRelease.textContent = movie.release_date ? `Release Date: ${movie.release_date}` : 'No release date available';
    modalOverview.textContent = movie.overview || 'No overview available';

    // Получение и отображение каст и команды
    const castCrewData = await getMovieCastCrew(movie.id);
    modalCastCrew.innerHTML = '';
    if (castCrewData && castCrewData.cast && castCrewData.cast.length > 0) {
        castCrewData.cast.slice(0, 5).forEach(person => {
            const castElement = document.createElement('p');
            castElement.textContent = `${person.name} as ${person.character}`;
            modalCastCrew.appendChild(castElement);
        });
    } else {
        modalCastCrew.innerHTML = '<p>No cast information available</p>';
    }

    // Получение и отображение отзывов
    const reviewsData = await getMovieReviews(movie.id);
    modalReviews.innerHTML = '';
    if (reviewsData.results && reviewsData.results.length > 0) {
        reviewsData.results.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `<strong>${review.author}</strong>: <p>${review.content}</p>`;
            modalReviews.appendChild(reviewElement);
        });
    } else {
        modalReviews.innerHTML = '<p>No reviews available</p>';
    }

    // Получение и отображение трейлера
    const trailerData = await getMovieTrailer(movie.id);
    modalTrailer.innerHTML = '';
    if (trailerData.results && trailerData.results.length > 0) {
        const trailerUrl = `https://www.youtube.com/embed/${trailerData.results[0].key}`;
        const iframe = document.createElement('iframe');
        iframe.src = trailerUrl;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        modalTrailer.appendChild(iframe);
    } else {
        modalTrailer.innerHTML = '<p>No trailer available</p>';
    }

    document.body.classList.add('modal-open');

    closeModalButton.addEventListener('click', () => {
        movieModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    });

    addToWatchlistButton.addEventListener('click', () => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        if (watchlist.some(item => item.id === movie.id)) {
            alert('This movie is already in your watchlist.');
            return;
        } else {
            watchlist.push(movie);
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    });


    movieModal.classList.add('show');
};
