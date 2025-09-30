const Recipe = require("../models/recipe");

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
            res.status(404).json({ message: "No recipe found!" })
        }
        res.status(200).json(recipe)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}