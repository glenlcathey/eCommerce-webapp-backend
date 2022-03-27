const mongoose = require('mongoose');

const Product = require('../models/product.js');

exports.products_get_all = (req, res, next) => {
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
                        url: 'http://localhost:5000/products/' + doc._id
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
};

exports.products_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('-__v -productImage')
        .exec()
        .then( returned_product => {
            console.log(returned_product);
            if (returned_product) {
                res.status(200).json({
                    product: returned_product,
                    request: {
                        type: 'GET',
                        url: "http://localhost:5000/products"
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
};

exports.products_create_product = (req, res, next) => {
    // console.log(req.file);  Prints incoming file information
    const product = new Product( {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.buffer
    });
    product
        .save()
        .then( result => {
            console.log("Created product \'" + result.name + "\' with ID \'" + result._id + "\'...");
            res.status(201).json({
                msg: "Handling POST request to /products with shown attributes!",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:5000/products/" + result._id
                    }
                }
            });
        })
        .catch( err => console.log(err));
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;    // Currently isn't possible to update product image
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
};

exports.products_delete_product = (req, res, next) => {
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
};