const User = require("../models/user");
const errorHandler = require('../utils/error');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignUp = async (req, res, next) => {
    let { email, password, passwordConfirm, name, profilePicture, username } = req.body;
    try {

        const userFromEmail = await User.findOne({ email })
        if (userFromEmail) {
            errorHandler("User with this email already exists.", 401);
        }
        const userFromUsername = await User.findOne({ username })
        if (userFromUsername) {
            errorHandler("Username is already taken.", 401);
        }
        if (password !== passwordConfirm) {
            errorHandler("Password should match.", 401)
        }
        if (!profilePicture) {
            profilePicture = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5FBH-i9W2GYVsE4y3QPE9QT1JRImQD9QkPg&s"
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            email,
            password: hashedPassword,
            profilePicture,
            username,
            name,
            recipes: [],
            favorites: [],
        })
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME }) // jwt token creation

        res.status(200).json({
            success: true,
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                username: newUser.username
            }
        });
        // return res.status(201).json({ message: "User created.", user: { email, username, profilePicture, name } })
    }
    catch (err) {
        console.log("Error occurred!", err)
        return res.status(err.status || 500).json({ message: "Wrong credentials" })
    }
}

exports.postSignIn = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(401).json({ message: "Invalid credentials." })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(403).json({ message: "Invalid credentials." }) // No user found
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res.status(403).json({ message: "Invalid credentials." }) // wrong password
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME }) // jwt token creation

        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                username: user.username
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "A server error occurred during login." })
    }
}

exports.getProfile = async (req, res, next) => {
    const { id } = req.body
    const user = User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "No user was found" });
    }
    user.password = undefined
    return res.status(200).json({ message: "User found successful." }, user)
}