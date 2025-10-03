const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    ingredients: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ],
    instructions: [{ type: String, required: true }],
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    votesUp: { type: Number, default: 0 },
    votesDown: { type: Number, default: 0 },
    voters: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            vote: { type: String, enum: ["up", "down"] }
        }
    ],
}, { timestamps: true })

recipeSchema.index({ tags: 1 });

module.exports = mongoose.model("Recipe", recipeSchema)