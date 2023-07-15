const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    amount: {
        type: Number,
        required: true,
        min: 18,
        max: 100,
    },
    credits: {
        type: Number,
        required: true,
    },
    transaction_id: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    description: {
        type: String,
        required: true,
        max: 100,
    },
    status: {
        type: String,
        default: "pending",
    },
    timestamps: true,
});

module.exports = mongoose.model("payment", paymentSchema);
