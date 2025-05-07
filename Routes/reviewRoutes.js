const { create, viewComments } = require("../Controllers/reviewController")
const authUser = require("../middleware/authUser")


const reviewRouter=require("express").Router()
reviewRouter.post("/create",authUser,create)
reviewRouter.get("/listreviews/:id",viewComments)








module.exports=reviewRouter