// Global variables
let recipes = [];      // To store recipes fetched from the server
let isEditing = false; // Flag to indicate editing mode
let editingIndex = -1; // Index of the recipe being edited

// Form submission
const submitRecipe = async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect data from the form fields
    const recipeName = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('ingredients').value;
    const cookingTime = document.getElementById('cooking-time').value;
    const _id = document.getElementById('recipe-id').value; // Collect _id for updating

    // Create a data object
    const data = {
        recipeName: recipeName,
        ingredients: ingredients,
        cookingTime: cookingTime
    };

    let url = '/submit';
    if (_id) {
        data._id = _id;
        url = '/update';
    }

    // Send data to the server
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Check the response
    if (response.ok) {
        // Reset the form and state
        event.target.reset();
        isEditing = false;
        editingIndex = -1;

        // Clear the hidden _id field
        document.getElementById('recipe-id').value = '';

        // Change button text back to 'Add Recipe'
        document.querySelector('#recipe-form button[type="submit"]').textContent = 'Add Recipe';
        document.getElementById('form-heading').textContent = 'Add a New Recipe';

        // Hide the cancel button
        document.getElementById('cancel-edit').style.display = 'none';

        // Show the recipes table
        document.getElementById('recipe-list').style.display = 'block';

        // Refresh the recipes list
        await fetchRecipes();
    } else {
        console.error('Failed to submit recipe');
    }
};

// Fetch and display recipes
const fetchRecipes = async function() {
    try {
        const response = await fetch('/api/recipes'); // Ensure the correct endpoint is used
        const text = await response.text();

        // Check if the response is an HTML page (indicating redirection to login)
        if (text.includes('<!DOCTYPE html>')) {
            window.location.href = '/login.html'; // Redirect to login page
            return;
        }

        // Parse the response as JSON if it's not an HTML page
        recipes = JSON.parse(text);
        updateRecipeTable(recipes);
    } catch (err) {
        console.error('Failed to fetch recipes', err);
    }
};



// Update the recipe table
const updateRecipeTable = function(recipes) {
    const tableBody = document.querySelector('#recipes-table tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    recipes.forEach((recipe, index) => {
        const row = document.createElement('tr');

        // Recipe Name
        const nameCell = document.createElement('td');
        nameCell.textContent = recipe.recipeName;
        row.appendChild(nameCell);

        // Ingredients
        const ingredientsCell = document.createElement('td');
        ingredientsCell.textContent = recipe.ingredients.join(', ');
        row.appendChild(ingredientsCell);

        // Cooking Time
        const timeCell = document.createElement('td');
        timeCell.textContent = `${recipe.cookingTime} min`;
        row.appendChild(timeCell);

        // Difficulty Level
        const difficultyCell = document.createElement('td');
        difficultyCell.textContent = recipe.difficultyLevel || 'N/A';
        row.appendChild(difficultyCell);

        // Actions (Edit and Delete Buttons)
        const actionsCell = document.createElement('td');

        // Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            editRecipe(index);
        };
        actionsCell.appendChild(editButton);

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteRecipe(index);
        };
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        // Append the row to the table body
        tableBody.appendChild(row);
    });
};


// Deleting a recipe
const deleteRecipe = async function(index) {
    // Ensure the index is valid
    if (index < 0 || index >= recipes.length) {
        console.error('Invalid index for deleting recipe');
        return;
    }

    // Get the recipe to be deleted
    const recipe = recipes[index];

    // Send the request to the server to delete the recipe
    const response = await fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: recipe._id }) // Send the _id of the recipe
    });

    if (response.ok) {
        // Fetch and display the updated recipes list
        fetchRecipes();
    } else {
        console.error('Failed to delete recipe');
    }
};

// Editing a recipe
const editRecipe = function(index) {
    // Ensure the index is valid
    if (index < 0 || index >= recipes.length) {
        console.error('Invalid index for editing recipe');
        return;
    }

    // Set editing mode
    isEditing = true;
    editingIndex = index;

    // Get the recipe data
    const recipe = recipes[index];

    // Populate the form fields with existing data
    document.getElementById('recipe-name').value = recipe.recipeName;
    document.getElementById('ingredients').value = recipe.ingredients.join(', ');
    document.getElementById('cooking-time').value = recipe.cookingTime;

    // Set a hidden field for _id
    document.getElementById('recipe-id').value = recipe._id; // Ensure this field exists in your HTML form

    // Change the form button text to 'Update Recipe'
    document.querySelector('#recipe-form button[type="submit"]').textContent = 'Update Recipe';
    document.getElementById('form-heading').textContent = 'Edit Recipe';
    document.getElementById('cancel-edit').style.display = 'inline-block';

    // Hide the recipes table
    document.getElementById('recipe-list').style.display = 'none';
};

// Handle cancel edit
document.getElementById('cancel-edit').onclick = function() {
    // Reset form and state
    document.getElementById('recipe-form').reset();
    isEditing = false;
    editingIndex = -1;

    // Clear the hidden _id field
    document.getElementById('recipe-id').value = '';

    // Change button text back to 'Add Recipe'
    document.querySelector('#recipe-form button[type="submit"]').textContent = 'Add Recipe';
    document.getElementById('form-heading').textContent = 'Add a New Recipe';

    // Hide the cancel button
    document.getElementById('cancel-edit').style.display = 'none';

    // Show the recipes table
    document.getElementById('recipe-list').style.display = 'block';
};

// Wait for the window to load
window.onload = function() {
    const form = document.getElementById('recipe-form');
    form.onsubmit = submitRecipe;

    // Fetch and display existing recipes
    fetchRecipes().catch((error) => console.error('Error in fetchRecipes:', error));
};
