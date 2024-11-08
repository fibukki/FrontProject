const apiKey="0c680be25cd54d37a769ebe2d3b02e72";

fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=1&addRecipeNutrition=true&sort=popularity`)
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
    ingredientsHtml +=
      "<li>" +
      ingredient.name +
      ": " +
      ingredient.amount +
      " " +
      ingredient.unit +
      "</li>";
  });

  return ingredientsHtml;
}

function createNutrientsHtml(nutrients) {
  let nutrientsHtml = "";

  for (let i = 0; i < 9; i++) {
    const nutrient = nutrients[i];

    nutrientsHtml +=
      "<li>" +
      nutrient.title +
      ": " +
      nutrient.amount +
      nutrient.unit +
      "</li>";
  }

  return nutrientsHtml;
}

function createRecipeHtml(recipe, ingredientsHtml, nutrientsHtml) {
  let recipeHtml = "";
  recipeHtml+='<div class="gallery-item">'
  recipeHtml+='<figure>';
  recipeHtml += '<img src="' + recipe.image + '" alt="recipe thumbnail" style="width: 100%; height: auto;" />';
  recipeHtml += '</figure>';
  recipeHtml += '<p>' + recipe.title + '</p>';
  recipeHtml += '<div class="card-info">'
  recipeHtml += '<p>Servings:<strong>'+recipe.servings+'</strong></p>'
  recipeHtml += '<p>Ready in:<strong>'+recipe.readyInMinutes+' mins</strong></p>'
  recipeHtml += '<p>Price per serv:<strong>'+recipe.pricePerServing+'$</strong></p>'
  recipeHtml += '<p>Health score:<strong>'+recipe.healthScore+'</strong></p>'
  recipeHtml += '</div>'
  recipeHtml += '</div>';

  return recipeHtml;
}

function setRecipeHtml(recipeHtml) {
  let gallery = document.querySelector(".gallery");

  gallery.innerHTML = recipeHtml;
}
