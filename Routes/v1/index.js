const adminRouter = require("./adminRoutes")
const paymentRouter = require("./paymentRoutes")
const userRouter = require("./userRoutes")

const v1Router=require("express").Router()

v1Router.use("/user",userRouter)

v1Router.use("/admin",adminRouter)

v1Router.use("/payment",paymentRouter)



module.exports=v1Router




