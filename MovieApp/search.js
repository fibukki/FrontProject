
export const handleSearch = async (query) => {
    const suggestionsList = document.querySelector('#suggestions');
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=9cffa19eb618a53678cd77c3faeeb3c3&query=${query}`);
    const data = await response.json();

    suggestionsList.innerHTML = '';
    data.results.forEach(movie => {
        const suggestionItem = document.createElement('li');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.dataset.id = movie.id;
        suggestionItem.textContent = movie.title;
        suggestionsList.appendChild(suggestionItem);
    });
};
