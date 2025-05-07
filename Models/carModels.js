const mongoose = require("mongoose")

const carSchema = new mongoose.Schema({
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealers",  // Make sure this matches your Dealer model name
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
       
    },
    description: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        
        default:true
    },
    vehicleNumber: {
        type: String,
        required: true
    } ,
    pricePerDay: {
        type: Number,
        required: true
    }


}, { timestamps :true})
module.exports = new mongoose.model("cars", carSchema)