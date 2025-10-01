const recipe = require("../models/recipe");
const Recipe = require("../models/recipe");
const errorHandler = require('../utils/error');

exports.getRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find()
        console.log(recipes)
        res.json(recipes)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getRecipe = async (req, res, next) => {
    try {
        const id = req.params.id
        const recipe = await Recipe.findById(id)
        if (!recipe) {
            errorHandler("No recipe found!", 404)
        }
        res.status(200).json(recipe)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.addRecipe = async (req, res, next) => {
    const { title, ingredients, prepTime, cookTime, instructions, description, imageUrl, tags, servings, userId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let finalImageUrl = imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
    try {
        const newRecipe = await Recipe.create({
            title,
            ingredients,
            prepTime,
            cookTime,
            instructions,
            description,
            imageUrl: finalImageUrl,
            tags,
            servings,
            author: userId
        })
        return res.status(201).json({ message: "Recipe added!", recipe: newRecipe })
    } catch (err) {
        next(err)
    }
}