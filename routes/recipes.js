const express = require("express");
const router = express.Router()
const { body } = require('express-validator');

const recipeController = require("../controllers/recipes")
const isAuth = require("./middleware/isAuth")


router.get('/', isAuth, recipeController.getRecipes);

router.get('/:id', isAuth, recipeController.getRecipe)

router.get('/most-popular', isAuth, recipeController.getMostPopular)

router.post('/add-recipe', isAuth, [
    body('title')
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

    body('ingredients')
        .isArray({ min: 1 }).withMessage("At least 1 ingredient is required."),

    body('ingredients.*.name')
        .trim()
        .notEmpty().withMessage("Ingredient name is required.").isLength({ max: 100 }).withMessage("Maximum length for ingredient name is 100 characters"),

    body('prepTime')
        .isInt({ min: 0, max: 1440 }).withMessage("Prep time must be between 0 and 1440 minutes"),

    body('cookTime')
        .isInt({ min: 0, max: 1440 }).withMessage("Cooking time must be between 0 and 1440 minutes"),

    body('instructions.*')
        .trim().notEmpty().withMessage("Instructions can't be empty").isLength({ min: 3, max: 600 }).withMessage("Instructions must have 3 to 600 characters"),

    body("description")
        .optional()
        .isLength({ max: 500 }).withMessage("Description too long (max 500 characters)"),

    body("imageUrl")
        .optional()
        .isURL().withMessage("Invalid image URL"),

    body("tags")
        .optional()
        .isArray({ max: 10 }).withMessage("Too many tags (max 10)"),

    body("tags.*")
        .trim()
        .isLength({ min: 1, max: 20 }).withMessage("Each tag must be 1-20 characters"),

    body("servings")
        .isInt({ min: 1, max: 100 }).withMessage("Servings must be between 1 and 100"),

], recipeController.addRecipe)

module.exports = router