import React, { useEffect, useState } from 'react';

function RecipeList() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            console.log('Fetching recipes...'); // Debug log
            try {
                const response = await fetch('/api/recipes');
                const data = await response.json();
                console.log('Fetched recipes:', data); // Debug log
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes().catch((error) => console.error('Error in fetchRecipes:', error));
    }, []);

    return (
        <section id="recipe-list">
            <h2>All Recipes</h2>
            <table id="recipes-table" className="table table-striped">
                <thead className="thead-dark">
                <tr>
                    <th>Recipe Name</th>
                    <th>Ingredients</th>
                    <th>Cooking Time</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {recipes.map((recipe, index) => (
                    <tr key={index}>
                        <td>{recipe.recipeName}</td>
                        <td>{recipe.ingredients.join(', ')}</td>
                        <td>{recipe.cookingTime} min</td>
                        <td>
                            <button className="btn btn-warning">Edit</button>
                            <button className="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default RecipeList;
