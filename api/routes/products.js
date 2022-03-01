const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        msg: "Handling GET request to /products!"
    });
});

router.post('/', (req, res, next) => {
    const product = {
        name :req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        msg: "Handling POST request to /products with shown attributes!",
        product: product
    });
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        msg: "Handling update request to /products!",
        Id: req.params.productID
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        msg: "Handling delete request to /products!",
        Id: productID
    });
});

module.exports = router;