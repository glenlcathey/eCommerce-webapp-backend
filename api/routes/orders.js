const express = require("express");
const mongoose = require("mongoose");
const Order = require('../models/order.js');
const router = express.Router();

const checkAuth = require('../middleware/check-auth.js');
const Product = require('../models/product.js');

router.get('/', checkAuth, (req, res, next) => {
    Order.find({})
        .select('-__v')
        .populate('product', '-__v -price')
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json(results.map(order => {
                return {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    req: {
                        type: 'GET',
                        url: "http://localhost:3000/orders/" + order._id
                    }
                }
            }));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('-__v')
        .populate('product', '-__v -price')
        .exec()
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(404).json({
                    message: "Order ID not found!"
                })
            }
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found in product database!"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.patch('/:orderId', checkAuth, (req, res, next) => {
    res.status(200).json({
        msg: "Handling update request to /orders!",
        Id: req.params.orderId
    });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderId)
        .exec()
        .then(result => { 
            console.log(result);
            res.status(200).json({
                message: "Successfully deleted order!",
                database_response: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;