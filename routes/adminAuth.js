const express = require('express');
const router = express.Router();
const Admin = require('../database/models/adminModal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminAuthentication = require('../middlewares/adminAuthentication');

const JWT_SECRET_ADMIN = process.env.JWT_ADMIN_SECRET;

router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;

        let admin = await Admin.findOne({email});
        if(!admin) {
            return res.status(401).json({message :'Please! Try again after sometime'});
        }

        const passwordCompare = await bcrypt.compare(password, admin.password);
        if (!passwordCompare) {
            return res.status(401).json({message: "Please try to login with correct credentials"});
        }

        const data = {
            admin : {
                id : admin._id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET_ADMIN);
        res.json({success : "true",authToken});
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({message: "Internal Server Error"});
    }
})

router.post('/addAdmin', adminAuthentication, async (req, res) => {   //middleware
    try{
        const {name, email, password} = req.body;

        let admin = await Admin.findOne({email}); 
        if(admin) {
            return res.status(400).json('Admin Already exists');
        }

        const salt = 10;
        const secPass = bcrypt.hash(password, salt);

        admin = await Admin.create({
            name,
            email,
            password: secPass,
        })

        res.json("Admin is added successfully!");
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;