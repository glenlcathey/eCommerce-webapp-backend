const express = require("express");
const Product = require('../models/product.js');
const mongoose = require('mongoose');
const { update } = require("../models/product.js");
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5   // 5 mb
    },
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
    Product.find({})
    .select('-__v')
    .exec()
    .then( result => {
        res.status(200).json( {
            count: result.length,
            products: result.map( doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json( {
            message: "Could not load products.",
            error: err
        });
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('-__v')
        .exec()
        .then( returned_product => {
            console.log(returned_product);
            if (returned_product) {
                res.status(200).json({
                    product: returned_product,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products"
                    }
                });
            } else {
                res.status(404).json( {message: "Entry for given ID not found."});
            }
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    });

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product( {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then( result => {
            console.log(result);
            res.status(201).json({
                msg: "Handling POST request to /products with shown attributes!",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch( err => console.log(err));
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps);
    Product.updateOne({ _id: id }, updateOps )
        .exec()
        .then( result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then( result => {
            res.status(200).json(result);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;