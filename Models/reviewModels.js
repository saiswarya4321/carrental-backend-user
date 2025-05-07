const { default: mongoose } = require("mongoose");


const reviewSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cars",  // Make sure this matches your Dealer model name
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",  // Make sure this matches your Dealer model name

    },
    comments: {
        type: String,
        required: true
    }
}, { timestamps: true })
module.exports = new mongoose.model("reviews", reviewSchema)
