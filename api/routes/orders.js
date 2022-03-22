const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth.js');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.get('/:orderId', checkAuth, OrdersController.orders_get_one);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.patch('/:orderId', checkAuth, (req, res, next) => {
    res.status(200).json({
        msg: "Handling update request to /orders!",
        Id: req.params.orderId
    });
});

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;