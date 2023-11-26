const express = require('express');
const Product = require('../database/models/productModal');
const Category = require('../database/models/categoryModal');
const router = express.Router();
const adminAuthentication = require('../middlewares/adminAuthentication');
// const userAuthentication = require('../middlewares/userAuthentication');

router.get('/getProducts', async (req, res) => {
    const products = await Product.find({});

    res.json(products);
})

router.get('/getProduct/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json('Product doesn\'t exist');
    }

    res.json(product);
})

router.post("/addProduct", adminAuthentication, async (req, res) => {
    try {
        const {productName, productPrice, productDescription, productCategory, productImage, productQuantity, productQuantityPiece} = req.body;

        let product = await Product.findOne({productName});
        if(product) {
            return res.status(404).send({'Message' : 'Product with this name is already present. Try with another name'});
        }

        product = await Product.create({
            admin: req.admin._id, productName, productPrice, productDescription, productCategory, productImage, productQuantity, productQuantityPiece
        })

        const catName = productCategory;
        const findCategory = await Category.findOne({ name: catName });

        if (findCategory) {
            findCategory.productIds.push(product._id);
            const updatedCategory = await Category.findByIdAndUpdate(findCategory._id, { $set: { productIds: findCategory.productIds } }, { new: true })
        }
        else {
            const newCategory = await Category.create({
                name: catName, productIds: [product._id]
            })
        }

        const products = await Product.find({});
        res.json({'Message' : "Product/Food Items has been added", products});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.patch('/updateProduct/:id',adminAuthentication, async(req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if(!product)  return res.status(404).send("Product is not found!");

        const {productName, productDescription, productCategory, productPrice, productImage, productQuantity, productQuantityPiece} = req.body;
        
        const newProduct = {};

        if(productName) {
            newProduct.productName = productName;
        }
        if(productDescription) {
            newProduct.productDescription = productDescription;
        }
        if(productPrice) {
            newProduct.productPrice = productPrice;
        }
        if(productCategory) {
            newProduct.productCategory = productCategory;
        }
        if(productImage) {
            newProduct.productImage = productImage;
        }
        if(productQuantity) {
            newProduct.productQuantity = productQuantity;
        }
        if(productQuantityPiece) {
            newProduct.productQuantityPiece = productQuantityPiece;
        }

        if (product.admin.toString() !== req.admin.id) {
            return res.status(401).send("Not Allowed");
        }

        product = await Product.findByIdAndUpdate(req.params.id, { $set: newProduct }, { new: true })
        res.json({ product, message: "Product has been updated successfully!" });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.delete('/deleteProduct/:id',adminAuthentication, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        const products = await Product.find({});

        res.json({'Message' : 'Product has been deleted successfully', products});
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;