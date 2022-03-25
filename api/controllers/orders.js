const mongoose = require("mongoose");

const Order = require('../models/order.js');
const Product = require('../models/product.js');

exports.orders_get_all = (req, res, next) => {
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
                        url: "http://localhost:5000/orders/" + order._id
                    }
                }
            }));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.orders_get_one = (req, res, next) => {
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
};

exports.orders_create_order = (req, res, next) => {
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
        });
};

exports.orders_delete_order = (req, res, next) => {
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
        });
};
