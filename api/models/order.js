const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: false, default: 1 }
})

module.exports = mongoose.model('Order', orderSchema);