const jwt = require('jsonwebtoken');
const Admin = require('../database/models/adminModal');

const adminAuthentication = async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!token) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }

        const admin = await Admin.findById(decoded.admin.id);
        if (!admin) {
            res.status(401).send({ result: "Please! Try again after sometime" })
            console.log("Please! Try again after sometime");
            return;
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(404).send({error:error.message});
    }
}

module.exports = adminAuthentication;