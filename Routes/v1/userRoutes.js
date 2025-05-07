
const { register, login, profile, updateProfile, logout, deleteuser, getAllUsers } = require("../../Controllers/userController");
const authAdmin = require("../../middleware/authAdmin");
const authUser = require("../../middleware/authUser");

const userRouter=require("express").Router();

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.get("/profile",authUser,profile)
userRouter.put("/update",authUser,updateProfile)
userRouter.post("/logout",logout)
userRouter.delete("/delete", authUser,deleteuser)











module.exports=userRouter;