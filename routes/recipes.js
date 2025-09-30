const express = require("express")
const router = express.Router()

const recipeController = require("../controllers/recipes")
const isAuth = require("./middleware/isAuth")


router.get('/', recipeController.getRecipes);

router.get('/:id', recipeController.getRecipe)


module.exports = router