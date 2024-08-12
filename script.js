const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const mainPhoto = document.getElementById('main-photo');
const initialView = document.getElementById('initial-view');
const homeButton = document.getElementById('home-button');

// Function to get recipes
const fetchRecipes = async (query) => {
    initialView.style.display = 'none';  // Hide the initial view
    recipeContainer.innerHTML = "<h2>You seriously need some gabagool..</h2>";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    recipeContainer.innerHTML = "";
    if (response.meals) {
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;
            const button = document.createElement('button');
            button.textContent = 'View Recipe';
            recipeDiv.appendChild(button);

            // Adding EventListener to recipe button
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });
            recipeContainer.appendChild(recipeDiv);
        });
    } else {
        recipeContainer.innerHTML = "<h2>No recipes found</h2>";
    }
};

const fetchIngredients = (meal) => {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }
    return ingredients;
};

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredients-list">${fetchIngredients(meal)}</ul>
        <h3>Instructions:</h3>
        <p class="instructions">${meal.strInstructions}</p>
    `;
    document.querySelector('.recipe-details').style.display = 'block';
};

// EventListener to close the popup
recipeCloseBtn.addEventListener('click', () => {
    document.querySelector('.recipe-details').style.display = 'none';
});

// EventListener for search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchBox.value.trim();
    if (query) {
        fetchRecipes(query);
    }
});

// EventListener for home button to reset the view
homeButton.addEventListener('click', () => {
    initialView.style.display = 'flex';  // Show the initial view
    recipeContainer.innerHTML = "";  // Clear any search results
    document.querySelector('.recipe-details').style.display = 'none';  // Hide any open recipe details
});
