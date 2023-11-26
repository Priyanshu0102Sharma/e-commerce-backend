const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require("./database/connectDB");
require("dotenv").config();

const corsOptions = {
    origin: true, 
    credentials: true
}

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors(corsOptions));

// routes
app.use("/api/user", require("./routes/userRoutes"))
app.use("/api/admin", require("./routes/adminAuth"))
app.use('/product/', require('./routes/product'));

app.listen(PORT, () => {
    console.log(`The server is running on PORT ${PORT}`);
})
