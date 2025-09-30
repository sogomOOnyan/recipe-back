const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignUp = async (req, res, next) => {

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