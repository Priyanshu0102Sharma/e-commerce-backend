const express = require('express')
const {registerController, loginController} = require('../Controllers/userController')

const router = express.Router();

// for register
router.post("/register", registerController);


// for login
router.post("/login", loginController)

module.exports = router;