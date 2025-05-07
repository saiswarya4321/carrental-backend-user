const { create, listbooking, getUserBooking, deletebooking, getDealerBooking } = require("../Controllers/bookingController")
const authUser = require("../middleware/authUser")
const authDealer = require("../middleware/authDealer")

const bookingRouter=require("express").Router()

bookingRouter.post("/create",create)
bookingRouter.get("/listbooking/:id",listbooking)
bookingRouter.get("/userbooking",authUser,getUserBooking)
bookingRouter.patch("/deletebooking/:bookingId",authUser,deletebooking)
bookingRouter.get("/getbooking",authDealer,getDealerBooking)



module.exports={bookingRouter}