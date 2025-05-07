const { create, listCars, carDetails, updateCar, deleteCar, listBrandorModel, setAvailability, listOne, getCar} = require("../Controllers/carController")
const authAdmin = require("../middleware/authAdmin")
const authDealer = require("../middleware/authDealer")
const authUser = require("../middleware/authUser")
const upload = require("../middleware/multer")

const carRouter=require("express").Router()
carRouter.post("/create",authDealer,upload.single("image"),create)
carRouter.get("/listcars",listCars)
carRouter.get("/cardetails/:dealerId",authDealer,carDetails)
carRouter.put("/update/:carId",upload.single("image"),updateCar)
carRouter.delete("/delete/:carId",deleteCar)
carRouter.get("/listcar",authUser,listBrandorModel)
carRouter.patch("/:id/unavailable",setAvailability)
carRouter.get("/listone/:id",authDealer,listOne)
carRouter.get("/getcars/:id",authUser,getCar)



module.exports=carRouter