const express = require("express");
const Product = require('../models/product.js');
const mongoose = require('mongoose');
const { update } = require("../models/product.js");
const router = express.Router();

router.get('/', (req, res, next) => {
    Product.find({})
    .exec()
    .then( result => {
        res.status(200).json( {
            meta_info: {
                count: result.length,
            },
            products: result
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
        .exec()
        .then( returned_product => {
            console.log(returned_product);
            if (returned_product) {
                res.status(200).json(returned_product);
            } else {
                res.status(404).json( {message: "Entry fot given ID not found."});
            }
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    });

router.post('/', (req, res, next) => {
    const product = new Product( {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then( result => {
            console.log(result);
        })
        .catch( err => console.log(err));
    res.status(201).json({
        msg: "Handling POST request to /products with shown attributes!",
        product: product
    });
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