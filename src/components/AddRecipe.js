import React, { useState } from 'react';

function AddRecipe() {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [cookingTime, setCookingTime] = useState('');

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const recipeData = {
            recipeName,
            ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
            cookingTime: parseInt(cookingTime)
        };

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipeData)
            });

            if (response.ok) {
                console.log('Recipe added successfully');
                // Clear the form fields
                setRecipeName('');
                setIngredients('');
                setCookingTime('');
            } else {
                console.error('Failed to add recipe');
            }
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    return (
        <section id="add-recipe" className="mb-5">
            <h2 id="form-heading">Add a New Recipe</h2>
            <form id="recipe-form" className="form" onSubmit={handleFormSubmit}>
                <input type="hidden" id="recipe-id" name="recipeId" />
                <div className="form-group">
                    <label htmlFor="recipe-name">Recipe Name:</label>
                    <input type="text" id="recipe-name" name="recipeName" className="form-control" placeholder="e.g., Chocolate Chip Cookies" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients (separated by commas):</label>
                    <textarea id="ingredients" name="ingredients" className="form-control" rows="5" placeholder="e.g., flour, sugar, eggs" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="cooking-time">Cooking Time (in minutes):</label>
                    <input type="number" id="cooking-time" name="cookingTime" className="form-control" min="1" placeholder="e.g., 45" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Recipe</button>
                <button type="button" id="cancel-edit" className="btn btn-secondary" style={{ display: 'none' }}>Cancel</button>
            </form>
        </section>
    );
}

export default AddRecipe;
