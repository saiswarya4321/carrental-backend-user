const mongoose=require("mongoose")


const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"admin"
    }
},{timestamps:true})

module.exports=new mongoose.model("admin",adminSchema)