//additional api keys
// const apiKey="0c680be25cd54d37a769ebe2d3b02e72";
// const apiKey ="ad7f90f4b68e420ab8fa11de2e849f45";
// const apiKey ='ba7be1a94ee64ab1bee19c501ee974bd';
// const apiKey ="d0aef524cfc14d6ba3f35bc68ab620b9";
// const apiKey ="06238180649d43e0bffc9f3ac6536dc3";
// const apiKey ="e37d7f29462257f1fa878816ec76418f";
// const apiKey ="cb1c464d94f142c08b156c5beddade8b";
// const apiKey ="02363275adea46d199a34266a31ea055";


const API_KEY = 'ba7be1a94ee64ab1bee19c501ee974bd';
const API_BASE_URL = 'https://api.spoonacular.com/recipes';
const favoriteButtonAttr = "data-add-to-favorite";

fetch(`${API_BASE_URL}/complexSearch?apiKey=${API_KEY}&number=10&addRecipeNutrition=true&sort=popularity`)
  .then(function (response) { return response.json(); })
  .then(function (data) {
    let recipeHtml = "";
    data.results.forEach(function (recipe) {
      let ingredientsHtml = createIngredientsHtml(recipe.nutrition.ingredients);
      let nutrientsHtml = createNutrientsHtml(recipe.nutrition.nutrients);
      recipeHtml += createRecipeHtml(recipe, true);
    });
    setRecipeHtml(recipeHtml);
    initializeFavoriteButtons();
  });

function createRecipeHtml(recipe, ingredientsHtml = "", nutrientsHtml = "", includeFavButton = true) {
  let recipeHtml = '<div class="card">';
  recipeHtml += '<div class="poster"><img src="' + recipe.image + '" alt="' + recipe.title + '" /></div>';
  recipeHtml += '<div class="details">';
  recipeHtml += '<h1>' + recipe.title + '</h1>';
  recipeHtml += '<h2>' + recipe.pricePerServing + '$ • ' + recipe.servings + ' servings • ' + recipe.readyInMinutes + ' mins</h2>';
  recipeHtml += '<div class="tags">';

  if (recipe.cuisines && recipe.cuisines.length > 0) {
    recipe.cuisines.forEach(function (element) {
      recipeHtml += '<span class="tag">' + element + '</span>';
    });
  }

  if (recipe.diets && recipe.diets.length > 0) {
    recipe.diets.forEach(function (element) {
      recipeHtml += '<span class="tag">' + element + '</span>';
    });
  }

  recipeHtml += '</div>';
  recipeHtml += '<p>' + recipe.summary.slice(0, 100) + '...</p>';

  if (includeFavButton) {
    recipeHtml += '<button ' + favoriteButtonAttr + '="' + recipe.id + '"><div class="heart-wrapper"><i class="far fa-heart"></i></div></button>';
  }

  recipeHtml += '</div>';
  recipeHtml += '</div>';
  return recipeHtml;
}

function setRecipeHtml(recipeHtml) {
  const gallery = document.querySelector(".wrapper");
  gallery.innerHTML = recipeHtml;
}

class FavoritesList {
  constructor() {
    this.storageName = "favorites";
    this.list = this.initList();
  }

  initList() {
    if (window.localStorage.getItem(this.storageName)) {
      const list = JSON.parse(window.localStorage.getItem(this.storageName));
      this.updateHtmlList(list);
      return list;
    } else {
      return [];
    }
  }

  initButton(button) {
    const id = String(button.getAttribute(favoriteButtonAttr));
    button.addEventListener('click', function () {
      const heartIcon = button.querySelector(".fa-heart");

      if (!this.list.includes(id)) {
        this.list.push(id);
      } else {
        this.list = this.list.filter(function (item) { return item !== id; });
      }

      this.setState(id, heartIcon);
      this.updateList();
    }.bind(this));

    const heartIcon = button.querySelector(".fa-heart");
    this.setState(id, heartIcon);
    return button;
  }

  setState(id, heartIcon) {
    if (heartIcon) {
      heartIcon.classList.toggle("background-heart", this.list.includes(id));
    }
  }

  updateList() {
    window.localStorage.setItem(this.storageName, JSON.stringify(this.list));
    this.updateHtmlList(this.list);
  }

  initClearButton(button) {
    button.addEventListener('click', function () {
      window.localStorage.removeItem(this.storageName);
      this.list = [];
      this.updateHtmlList([]);
    }.bind(this));
  }

  async updateHtmlList(list) {
    const favoritesHTMLElement = document.querySelector('#wrapper1');

    if (list.length > 0) {
      const newList = list.slice(0).reverse();
      favoritesHTMLElement.innerHTML = '';

      for (const itemId of newList) {
        try {
          const recipe = await fetchRecipeData(itemId);
          if (recipe) {
            let recipeHtml = createRecipeHtml(recipe, "", "", false);
            const htmlDiv = document.createElement('div');
            htmlDiv.classList.add('favorite-card');
            htmlDiv.innerHTML = recipeHtml;
            favoritesHTMLElement.appendChild(htmlDiv);
          }
        } catch (error) {
          console.error(`Failed to fetch recipe with ID ${itemId}:`, error);
        }
      }
    } else {
      favoritesHTMLElement.innerHTML = 'No favorite recipes!';
    }
  }
}

async function fetchRecipeData(recipeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Recipe not found with ID: ${recipeId}`);
        return null;
      }
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.image || !data.title) {
      throw new Error(`Incomplete data received from API for recipe ID: ${recipeId}`);
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch recipe with ID ${recipeId}:`, error);
    return null;
  }
}

function initializeFavoriteButtons() {
  const buttons = document.querySelectorAll(`[${favoriteButtonAttr}]`);
  buttons.forEach(function (button) { favorites.initButton(button); });
}

function createIngredientsHtml(ingredients) {
  let ingredientsHtml = "";
  ingredients.forEach(function (ingredient) {
    ingredientsHtml += '<li>' + ingredient.name + ': ' + ingredient.amount + ' ' + ingredient.unit + '</li>';
  });
  return ingredientsHtml;
}

function createNutrientsHtml(nutrients) {
  let nutrientsHtml = "";
  nutrients.slice(0, 9).forEach(function (nutrient) {
    nutrientsHtml += '<li>' + nutrient.title + ': ' + nutrient.amount + nutrient.unit + '</li>';
  });
  return nutrientsHtml;
}

const favorites = new FavoritesList();
const emptyFavoritesButton = document.querySelector('.clear_favorites');
if (emptyFavoritesButton) {
  favorites.initClearButton(emptyFavoritesButton);
}
const displayFavButton = document.querySelector('.display_fav');
const wrapper1 = document.getElementById('wrapper1');

wrapper1.style.display = 'none';

displayFavButton.addEventListener('click', function () {
  if (wrapper1.style.display === 'none' || wrapper1.style.display === '') {
    wrapper1.style.display = 'flex';
  } else {
    wrapper1.style.display = 'none';
  }
});


// recipe desc
const recipeModal = document.getElementById('recipeModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalNutrients = document.getElementById('#modalNutrients');


const modalDescription = document.getElementById('modalDescription');
const modalIngredients = document.getElementById('modalIngredients');
const modalInstructions = document.getElementById('modalInstructions');
const closeButton = document.querySelector('.close-button');

function openModal(recipe) {
  modalTitle.textContent = recipe.title;
  modalImage.src = recipe.image;
  modalDescription.innerHTML = recipe.summary;
  modalIngredients.innerHTML = '';
  recipe.extendedIngredients.forEach(function (ingredient) {
    const listItem = document.createElement('li');
    listItem.textContent = `${ingredient.name}: ${ingredient.amount.toFixed(1)} ${ingredient.unit}`;
    modalIngredients.appendChild(listItem);
  });
  // modalNutrients.innerHTML = createNutrientsHtml(recipe)
  modalInstructions.innerHTML = recipe.instructions;

  recipeModal.style.display = 'block';
}

closeButton.addEventListener('click', function () {
  recipeModal.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target === recipeModal) {
    recipeModal.style.display = 'none';
  }
});

async function fetchAndShowRecipeDetails(recipeId) {
  try {
    const recipe = await fetchRecipeData(recipeId);
    if (recipe) {
      openModal(recipe);
    }
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  }
}

function createRecipeHtml(recipe, includeFavButton = true) {
  let recipeHtml = '<div class="card" data-recipe-id="' + recipe.id + '">';
  recipeHtml += '<div class="poster"><img src="' + recipe.image + '" alt="' + recipe.title + '" /></div>';
  recipeHtml += '<div class="details">';
  recipeHtml += '<h1>' + recipe.title + '</h1>';
  recipeHtml += '<h2>' + recipe.pricePerServing + '$ • ' + recipe.servings + ' servings • ' + recipe.readyInMinutes + ' mins</h2>';
  recipeHtml += '<div class="tags">';

  if (recipe.cuisines && recipe.cuisines.length > 0) {
    recipe.cuisines.forEach(function (element) {
      recipeHtml += '<span class="tag">' + element + '</span>';
    });
  }

  if (recipe.diets && recipe.diets.length > 0) {
    recipe.diets.forEach(function (element) {
      recipeHtml += '<span class="tag">' + element + '</span>';
    });
  }

  recipeHtml += '</div>';
  recipeHtml += '<p>' + (recipe.summary ? recipe.summary.slice(0, 100) + '...' : '') + '</p>';

  if (includeFavButton) {
    recipeHtml += '<button ' + favoriteButtonAttr + '="' + recipe.id + '"><div class="heart-wrapper"><i class="far fa-heart"></i></div></button>';
  }

  recipeHtml += '</div>';
  recipeHtml += '</div>';

  return recipeHtml;
}

document.addEventListener('click', function (event) {
  if (event.target.closest('.card')) {
    const recipeId = event.target.closest('.card').getAttribute('data-recipe-id');
    fetchAndShowRecipeDetails(recipeId);
  }
});

//search
let allRecipes = [];
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  const searchText = searchBar.value.trim().toLowerCase();
  fetchRecipes(searchText);
});

async function fetchRecipes(ingredients = "") {
  try {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const basicData = await response.json();

    const fullDetails = await Promise.all(basicData.map(recipe => fetchRecipeData(recipe.id)));

    const validRecipes = fullDetails.filter(recipe => recipe !== null);
    displayRecipes(validRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
}

function displayRecipes(recipes) {
  let recipeCard = "";
  recipes.forEach(recipe => {
    recipeCard += createRecipeHtml(recipe, true);
  });
  setRecipeHtml(recipeCard);

  initializeFavoriteButtons();
}

const autocompleteDropdown = document.getElementById("autocompleteDropdown");
const autocompleteList = document.getElementById("autocompleteList");

function fetchAutocompleteSuggestions(query) {
  fetch(`${API_BASE_URL}/autocomplete?query=${query}&number=3&apiKey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      showAutocompleteSuggestions(data);
    })
    .catch(error => console.error("Error fetching autocomplete suggestions:", error));
}

function showAutocompleteSuggestions(suggestions) {
  autocompleteList.innerHTML = "";
  autocompleteDropdown.style.display = suggestions.length > 0 ? "block" : "none";
  suggestions.forEach(suggestion => {
    const listItem = document.createElement("li");
    listItem.textContent = suggestion.title;
    listItem.addEventListener("click", () => selectSuggestion(suggestion.title));
    autocompleteList.appendChild(listItem);
  });
}

function selectSuggestion(selectedRecipe) {
  searchBar.value = selectedRecipe;
  autocompleteDropdown.style.display = "none";
  fetchRecipes(selectedRecipe);
}

searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim();
  if (query.length > 1) {
    fetchAutocompleteSuggestions(query);
  } else {
    autocompleteDropdown.style.display = "none";
  }
});

document.addEventListener("click", (event) => {
  if (!autocompleteDropdown.contains(event.target) && event.target !== searchBar) {
    autocompleteDropdown.style.display = "none";
  }
});