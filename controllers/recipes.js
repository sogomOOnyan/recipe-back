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
    const normalizedTags = tags.map(tag => tag.toLowerCase())
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
            tags: normalizedTags,
            servings,
            author: userId
        })
        return res.status(201).json({ message: "Recipe added!", recipe: newRecipe })
    } catch (err) {
        next(err)
    }
}

exports.getSearch = async (req, res, next) => {
    const searchWords = req.body.searchWord;
    if (!searchWords || !Array.isArray(searchWords) || searchWords.length === 0) {
        return res.status(400).json({ message: "An array of search tags is required." });
    }

     if (typeof searchWord === "string") {
        searchWord = searchWord.toLowerCase().split(/\s+/); // split on spaces
    }

    const lowerSearchWords = searchWords.map(word => word.toLowerCase());

    try {
        const searchedRecipes = await Recipe.find({
            tags: { $in: lowerSearchWords.map(word => new RegExp(word, "i")) }
        });
        return res.status(200).json({ message: "Search completed successfully", recipes: searchedRecipes })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something went wrong." })
    }
}

exports.getMostPopular = async (req, res, next) => {
    try {
        const popularRecipes = await Recipe.aggregate([
            {
                $project: {
                    name: "$name",
                    tags: "$tags",
                    votesUpCount: { $size: "$votesUp" },
                    votesDownCount: { $size: "$votesDown" },
                    popularityScore: {
                        $add: [
                            { $multiply: [2, { $size: "$votesUp" }] },
                            { $size: "$votesDown" }
                        ]
                    }
                }
            },
            {
                $sort: {
                    popularityScore: -1
                }
            },
            {
                $limit: 5
            }
        ])
        return res.status(200).json({ message: "Popular posts sent!", recipes: popularRecipes })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong on server" })
    }
}