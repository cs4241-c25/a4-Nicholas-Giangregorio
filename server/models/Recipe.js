const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    cookingTime: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Recipe', RecipeSchema, 'recipes');
