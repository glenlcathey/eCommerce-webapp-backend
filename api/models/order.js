const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_id: mongoose.Schema.Types.ObjectId,
    quantity: Number
})

module.exports = mongoose.model('Order', orderSchema);