
const { register, profile, updateProfile, logout, getAllDealers } = require("../Controllers/dealerController");
const { login } = require("../Controllers/dealerController");
const authDealer = require("../middleware/authDealer");

const DealerRoutes=require("express").Router()


DealerRoutes.post("/dealer/register",register)
DealerRoutes.post("/dealer/login",login)
DealerRoutes.get("/dealer/profile",authDealer,profile)
DealerRoutes.put("/dealer/update",authDealer,updateProfile)
DealerRoutes.post("/dealer/logout",logout)




module.exports=DealerRoutes;