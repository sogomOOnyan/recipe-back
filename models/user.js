const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    bio: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
