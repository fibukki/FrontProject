Recipe App
A user-friendly application for searching, exploring, and saving recipes. Powered by the Spoonacular API, it allows users to search recipes, save favorites, and access detailed recipe information like ingredients, nutrition, and instructions.

Features
Search Recipes: Search for popular recipes or by specific ingredients.
Favorites: Save recipes to a favorites list stored in localStorage.
Details Modal: View comprehensive recipe details in a modal window.
Autocomplete: Get real-time recipe suggestions as you type.
Setup
API Key: Obtain a Spoonacular API key and set it in api.js.
File Structure:
index.html: Main layout.
style.css: Styling.
api.js: Primary JavaScript functions.
Key Components
Recipe Cards: Displays dynamic recipe cards with images, titles, and tags.
Favorites List: Persistent favorites stored in localStorage.
Modal Details: Shows ingredients, nutrition facts, and instructions.
Autocomplete Search: Provides real-time recipe suggestions based on input.
Weather App
This weather application shows the current weather, a five-day forecast, and city suggestions for multiple locations. Users can switch between Celsius and Fahrenheit, view detailed weather conditions, and select their current location with ease.

Features
Current Weather & Forecast: Displays temperature, humidity, wind speed, sunrise/sunset times, and a five-day forecast.
City Suggestions: Shows relevant city suggestions as users type.
Temperature Toggle: Switch between Celsius and Fahrenheit.
Current Location: Uses device GPS to show weather for the current location.
Keyboard & Button Controls: Search with Enter or a button click.
Setup
API Key: Get an OpenWeatherMap API key and set it in apiKey.
File Structure:
index.html: Layout structure.
style.css: UI styling.
api.js: Fetches and displays weather data.
Key Components
Weather & Forecast Data: Current weather and a five-day forecast from OpenWeatherMap API.
Location-Based Search: Find weather details by city or using device location.
Autocomplete Suggestions: Display city suggestions based on input.
Temperature Conversion: Toggle between Celsius and Fahrenheit.
Movies App
A web application for discovering, browsing, and saving favorite movies using The Movie Database (TMDb) API. This app allows users to search for movies, sort them, and add them to a watchlist.

Features
Search Functionality: Search movies by title with auto-suggest.
Display Movies: Grid layout displaying posters, titles, and release dates.
Movie Details:
Synopsis: Brief summary of the movie.
Rating & Runtime: Movie rating and duration.
Cast & Crew: Key members involved.
Watchlist: Save movies to a watchlist with localStorage for persistence.
Setup
Key Components
Search & Display: Search for movies and display them in a grid.
Movie Details: Show detailed movie information in a modal or new section.
Watchlist: Add/remove movies to a watchlist with localStorage.

Usage
Clone the repository:
git clone https://github.com/fibukki/FrontProject
Update API_KEY in api.js.
Open index.html in your browser.