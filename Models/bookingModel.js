
const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cars'
    },
    model: String,
    days: Number,
    totalAmount: Number,
    paymentStatus: String,
    sessionId: String,
    status: { type: String, default: "active" }

   

},{ timestamps: true })
module.exports = mongoose.model('booking', bookingSchema);