const { register ,login, logout, profile, updateProfile, deleteUser, deleteDealer, deleteBooking, getAllCars, deleteCars, deactivateBooking} = require("../../Controllers/adminController");
const { getAllBooking } = require("../../Controllers/bookingController");
const { getAllDealers } = require("../../Controllers/dealerController");
const { getAllUsers } = require("../../Controllers/userController");
const authAdmin = require("../../middleware/authAdmin");

const adminRouter=require("express").Router()

adminRouter.post("/register",register);
adminRouter.post("/login",login)
adminRouter.post("/logout",logout)
adminRouter.get("/profile",authAdmin,profile)
adminRouter.put("/update", authAdmin, updateProfile);
adminRouter.get("/allusers",getAllUsers)
adminRouter.get("/alldealers",getAllDealers)
adminRouter.get("/allbooking",getAllBooking)
adminRouter.delete("/deleteuser/:id",deleteUser)
adminRouter.delete("/deletedealer/:id",deleteDealer)
adminRouter.delete("/deletebooking/:id",deleteBooking)
adminRouter.get("/allcars",getAllCars)
adminRouter.delete("/deletecars/:id",deleteCars)
adminRouter.patch("/deactivatebooking/:id",deactivateBooking)




module.exports=adminRouter