const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');


router.post('/submit', (req, res) => {
    const { recipeName, ingredients, cookingTime } = req.body;
    // Save the recipe to the database
    // Respond with success
    res.json({ message: 'Recipe submitted successfully' });
});


router.get('/recipes', (req, res) => {
    // Fetch recipes from the database
    // Respond with the list of recipes
    res.json([/* array of recipes */]);
});


router.post('/update', (req, res) => {
    const { _id, recipeName, ingredients, cookingTime } = req.body;
    // Update the recipe in the database
    // Respond with success
    res.json({ message: 'Recipe updated successfully' });
});


router.post('/delete', (req, res) => {
    const { _id } = req.body;
    // Delete the recipe from the database
    // Respond with success
    res.json({ message: 'Recipe deleted successfully' });
});


router.post('/users', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();
        res.json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


router.post('/users/delete', async (req, res) => {
    const { username } = req.body;

    try {
        await User.deleteOne({ username });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


// Route to add a new recipe
router.post('/recipes', async (req, res) => {
    const { recipeName, ingredients, cookingTime } = req.body;
    console.log('Received recipe data:', { recipeName, ingredients, cookingTime }); // Debug log

    try {
        const newRecipe = new Recipe({ recipeName, ingredients, cookingTime });
        await newRecipe.save();
        console.log('Recipe added successfully:', newRecipe); // Debug log
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Failed to add recipe' });
    }
});

// Route to fetch all recipes
router.get('/recipes', async (req, res) => {
    try {
        console.log('Fetching recipes from the database...'); // Debug log
        const recipes = await Recipe.find();
        console.log('Recipes fetched from the database:', recipes); // Debug log
        res.json(recipes); // Return the fetched recipes as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

module.exports = router;
