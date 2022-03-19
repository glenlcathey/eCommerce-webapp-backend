const express = require("express");
const mongoose = require("mongoose");
const Order = require('../models/order.js');
const router = express.Router();

router.get('/', (req, res, next) => {
    Order.find({})
        .select('-__v')
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json(results.map(order => {
                return {
                    _id: order._id,
                    product_id: order.product_id,
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

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('-__v')
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product_id: req.body.productId,
        quantity: req.body.quantity
    })
    order
        .save()
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

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        msg: "Handling update request to /orders!",
        Id: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
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