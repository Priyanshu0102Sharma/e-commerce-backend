const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');

const userAuthentication = async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!token) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }

        const user = await User.findById(decoded.user.id);

        if (!user) {
            res.status(401).send({ result: "User not found" })
            console.log("User not found");
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(404).send({error:error.message});
    }
}

module.exports = userAuthentication;