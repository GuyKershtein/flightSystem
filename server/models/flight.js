const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    source: {
        required: true,
        type: String
    },
    destination: {
        required: true,
        type: String
    },
    from: {
        required: true,
        type: Date
    },
    to: {
        required: true,
        type: Date
    },
    price: {
        required: true,
        type: Number
    },
    discountedPrice: {
        required: false,
        type: Number
    }
});

module.exports = mongoose.model('flight', dataSchema);