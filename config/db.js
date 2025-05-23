const { default: mongoose } = require("mongoose");

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("db connected successfully!")
    }
    catch (error) {
        console.log(error)
         console.log("db not connected !")
    }

}

module.exports={connectionDB};
