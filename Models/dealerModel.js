const mongoose = require("mongoose")

const dealerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    contactNumber: {
        type: Number,
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cars",  // Make sure this matches your Dealer model name
        
    },
    role: {
        type: String,
        enum: ['user', 'dealer', 'admin'],
        default: 'dealer'
    }

}, { timestamps: true })
module.exports = new mongoose.model("dealers", dealerSchema)