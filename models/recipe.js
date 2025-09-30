const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    prepTime: { type: mongoose.Schema.Types.Int32, required: true },
    cookTime: { type: mongoose.Schema.Types.Int32, required: true },
    servings: { type: mongoose.Schema.Types.Int32, required: true },
    author: { type: mongoose.Schema.Types.Int32, required: true },
    votesUp: { type: Number, default: 0 },
    votesDown: { type: Number, default: 0 },
    voters: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            vote: { type: String, enum: ["up", "down"] }
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model("Recipe", recipeSchema)