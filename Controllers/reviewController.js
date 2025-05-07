const carModels = require("../Models/carModels");
const carDb = require("../Models/carModels");
const reviewModels = require("../Models/reviewModels");



const create = async (req, res) => {
    try {

        const userId = req.user;
        

        const { comments,carId } = req.body
        if (!comments) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const newReview = new reviewModels({
            userId, carId, comments
        })
        let saveReview = await newReview.save();
        if (saveReview) {
            return res.status(200).json({ message: "Successfully saved" })
        }

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}
const viewComments= async(req,res)=>{
try {
    const id = req.params.id;
    const cars= await reviewModels.find({carId:id})
    if(!cars){
        return res.status(400).json({error:"Not found cars"})
    }
    return res.json(cars)  
} catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message || "internal server error" })
}
}
module.exports={
    create,viewComments
}