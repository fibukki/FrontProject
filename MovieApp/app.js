import { getAllMoviesByPage, searchMovies, getMovieDetails } from './tmdb.js';
import { MovieList } from './movie-list.js';
import { showMovieModal } from './movie-modal.js';
import { handleSearch } from './search.js';

document.addEventListener("DOMContentLoaded", () => {
    let state = {
        page: 1,
        sortOption: 'popularity.desc',
        isSearching: false,
        query: '',
        selectedMovie: null,
    };

    const elements = {
        prevButton: document.querySelector('#prev-button'),
        nextButton: document.querySelector('#next-button'),
        currentPage: document.querySelector('#current-page'),
        sortSelect: document.querySelector('#sort-select'),
        searchInput: document.querySelector('#search-input'),
        suggestionsList: document.querySelector('#suggestions'),
        movieModal: document.querySelector('#movie-modal'),
        closeModalButton: document.querySelector('#close-modal'),
        addToWatchlistBtn: document.querySelector('#add-to-watchlist'),
    };

    const updateMovies = async () => {
        const { isSearching, query, page, sortOption } = state;
        let moviesData = isSearching && query
            ? await searchMovies(query, page)
            : await getAllMoviesByPage(page, sortOption);

        MovieList(moviesData.results);
        elements.prevButton.disabled = page === 1;
        elements.nextButton.disabled = page === moviesData.total_pages;
        elements.currentPage.textContent = `Page ${page}`;
    };

    const setupEventListeners = () => {
        elements.prevButton.addEventListener('click', () => {
            if (state.page > 1) {
                state.page--;
                updateMovies();
            }
        });

        elements.nextButton.addEventListener('click', () => {
            state.page++;
            updateMovies();
        });

        elements.sortSelect.addEventListener('change', (e) => {
            state.sortOption = e.target.value;
            state.page = 1;
            state.isSearching = false;
            updateMovies();
        });

        elements.searchInput.addEventListener('input', async (e) => {
            state.query = e.target.value;
            state.isSearching = !!state.query.trim();
            if (state.isSearching) {
                await handleSearch(state.query);
                elements.suggestionsList.classList.add('show');
            } else {
                elements.suggestionsList.classList.remove('show');
            }
        });

        elements.suggestionsList.addEventListener('click', async (e) => {
            if (e.target && e.target.classList.contains('suggestion-item')) {
                const movieId = e.target.dataset.id;
                const movieDetails = await getMovieDetails(movieId);
                state.selectedMovie = movieDetails;
                showMovieModal(movieDetails);
                document.body.classList.add('modal-open');
                elements.movieModal.classList.add('show');
            }
        });

        elements.closeModalButton.addEventListener('click', () => {
            document.body.classList.remove('modal-open');
            elements.movieModal.classList.remove('show');
            state.selectedMovie = null;
        });

        elements.addToWatchlistBtn.addEventListener('click', () => {
            if (state.selectedMovie) {
                addToWatchlist(state.selectedMovie);
            }
        });
    };

    const addToWatchlist = (movie) => {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const movieExists = watchlist.some(item => item.id === movie.id);

        if (!movieExists) {
            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            alert(`${movie.title} has been added to your watchlist!`);
        } else {
            alert('This movie is already in your watchlist.');
        }
    };

    setupEventListeners();
    updateMovies();

});
