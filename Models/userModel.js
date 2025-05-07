const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
  
    role: {
        type: String,
        enum: ['user', 'dealer', 'admin'],
        default: 'user'
    },
    contactNumber: {
        type: Number,
        required: true

    }

}, { timestamps: true });

module.exports = new mongoose.model("user", userSchema);