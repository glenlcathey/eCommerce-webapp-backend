const express = require("express");
const Order = require('../models/order.js');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        msg: "Handling GET request to /orders! This returns all orders!"
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        msg: `Handling GET request to /orders! This returns information regarding order #${req.params.orderId}.`
    });
});

router.post('/', (req, res, next) => {
    const order = {
        orderId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        msg: "Handling POST request to /orders with shown attributes!",
        order: order
    });
});

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        msg: "Handling update request to /orders!",
        Id: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        msg: "Handling delete request to /orders!",
        Id: req.params.orderId
    });
});

module.exports = router;