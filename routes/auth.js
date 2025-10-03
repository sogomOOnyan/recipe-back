const express = require("express")
const router = express.Router();

const isAuth = require('../middleware/isAuth')
const authController = require("../controllers/auth")

router.post('/signin', authController.postSignIn)

router.post('/signup', authController.postSignUp)

router.get('/profile/:id', isAuth, authController.getProfile)

module.exports = router