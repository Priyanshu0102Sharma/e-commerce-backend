const mongoose = require('mongoose');

const productSchema = mongoose.Schema ({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    productName:{
        type:String,
        required: true,
        unique:true
    },
    productDescription:{
        type:String
    },   
    productPrice:{
        type:Number,
        required:true
    },
    productCategory:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        default:'https://banner2.cleanpng.com/20180618/ru/kisspng-indian-cuisine-jalebi-kachori-samosa-vegetarian-cu-5b27bcdf929538.5759893615293309116004.jpg'
    },
    productQuantity:{
        type:Number,
        required: true
    },
    productQuantityPiece:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        default:'https://banner2.cleanpng.com/20180618/ru/kisspng-indian-cuisine-jalebi-kachori-samosa-vegetarian-cu-5b27bcdf929538.5759893615293309116004.jpg'
    },
    rating: {
        type: Number,
        default: 0
    },
    avgRating: {
        type: Number,
        default: 0
    },
    totalPeople: {
        type: Number,
        default: 0
    }
})

const Product = mongoose.model("Product",productSchema);

module.exports = Product;