const apiKey="0c680be25cd54d37a769ebe2d3b02e72";

fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=2&addRecipeNutrition=true&sort=popularity`)
.then((response) => response.json())
  .then((data) => {
    let recipeHtml = "";

    data.results.forEach((recipe) => {
      let ingredientsHtml = createIngredientsHtml(recipe.nutrition.ingredients);
      let nutrientsHtml = createNutrientsHtml(recipe.nutrition.nutrients);
      recipeHtml += createRecipeHtml(recipe, ingredientsHtml, nutrientsHtml);
    });

    setRecipeHtml(recipeHtml);
  });

function createIngredientsHtml(ingredients) {
  let ingredientsHtml = "";
  ingredients.forEach((ingredient) => {
    ingredientsHtml += "<li>" + ingredient.name + ": " + ingredient.amount + " " + ingredient.unit + "</li>";
  });
  return ingredientsHtml;
}

function createNutrientsHtml(nutrients) {
  let nutrientsHtml = "";
  for (let i = 0; i < 9; i++) {
    const nutrient = nutrients[i];
    nutrientsHtml += "<li>" + nutrient.title + ": " + nutrient.amount + nutrient.unit + "</li>";
  }
  return nutrientsHtml;
}

function createRecipeHtml(recipe, ingredientsHtml, nutrientsHtml) {
  let recipeHtml = '<div class="card">';
  recipeHtml += '<div class="poster"><img src="' + recipe.image + '" alt="' + recipe.title + '" style="width: 100%; height: 100%;" /></div>';
  recipeHtml += '<div class="details">';
  recipeHtml += '<h1>' + recipe.title + '</h1>';
  recipeHtml += '<h2>' + recipe.pricePerServing + '$ • ' + recipe.servings + ' servings • ' + recipe.readyInMinutes + ' mins</h2>';
  recipeHtml += '<div class="tags">';

  if (recipe.cuisines && recipe.cuisines.length > 0) {
    recipe.cuisines.forEach(element => {
      recipeHtml += '<span class="tag">' + element + '</span>';
    });
  }

  if (recipe.diets && recipe.diets.length > 0) {
    recipe.diets.forEach(element => {
      recipeHtml += '<span class="tag">' + element + '</span>';
    });
  }

  const description = recipe.summary.slice(0, 150);
  recipeHtml += '</div>';
  recipeHtml += '<p class="desc">' + description + '...</p>';
  recipeHtml += '<button class="favorite-btn" data-id="' + recipe.id + '" onclick="addToFavorites(' + recipe.id + ')">Add to Favorites</button>';
  recipeHtml += '</div></div>';
  return recipeHtml;
}

function addToFavorites(recipeId) {
  // Get the current list of favorite recipes from localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Check if the recipe is already in the favorites list
  if (favorites.includes(recipeId)) {
    // If it's already a favorite, update the button text and exit the function
    const button = document.querySelector(`.favorite-btn[data-id='${recipeId}']`);
    if (button) {
      button.innerText = 'Already in Favorites';
      button.disabled = true; // Optionally disable the button to prevent further clicks
    }
    return; // Exit the function since the recipe is already in favorites
  }

  // Add the recipeId to the favorites list
  favorites.push(recipeId);

  // Save the updated favorites list back to localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));

  // Update the button text for the specific recipe
  const button = document.querySelector(`.favorite-btn[data-id='${recipeId}']`);
  if (button) {
    button.innerText = 'Added to Favorites';
    button.disabled = true; // Optionally disable the button
  }
}

function appendRecipeToFavorites(recipeHtml) {
  let gallery = document.querySelector(".wrapper");
  gallery.innerHTML += recipeHtml;
}

function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length === 0) {
    alert('You have no favorite recipes!');
    return;
  }

  favorites.forEach(recipeId => {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
      .then(response => response.json())
      .then(recipe => {
        // Check if nutrition data is available
        let ingredientsHtml = "";
        let nutrientsHtml = "";

        if (recipe.nutrition) {
          ingredientsHtml = recipe.nutrition.ingredients ? createIngredientsHtml(recipe.nutrition.ingredients) : "";
          nutrientsHtml = recipe.nutrition.nutrients ? createNutrientsHtml(recipe.nutrition.nutrients) : "";
        }

        let recipeHtml = createRecipeHtml(recipe, ingredientsHtml, nutrientsHtml);
        appendRecipeToFavorites(recipeHtml);
      })
      .catch(error => console.error('Error loading favorite recipe:', error));
  });
}


document.addEventListener("DOMContentLoaded", loadFavorites);

document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('favorite-btn')) {
    const recipeId = event.target.getAttribute('data-id');
    addToFavorites(recipeId);
  }
});
function updateFavoriteButtons() {
  // Retrieve the list of favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Loop through all favorite buttons and update their text if they are in favorites
  favorites.forEach(recipeId => {
    const button = document.querySelector(`.favorite-btn[data-id='${recipeId}']`);
    if (button) {
      button.innerText = 'Already in Favorites';
      button.disabled = true; // Optionally disable the button
    }
  });
}

function setRecipeHtml(recipeHtml) {
  let gallery = document.querySelector(".wrapper");
  gallery.innerHTML = recipeHtml;
}
