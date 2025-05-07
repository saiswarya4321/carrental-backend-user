const carDb = require("../Models/carModels")
const dealerDb = require("../Models/dealerModel")

const uploadToCloudinary = require("../utilities/imageUpload")


const create = async (req, res) => {
    try {
       

        console.log("car api calling")

        const {  brand, model, year, registrationNumber, location, description, vehicleNumber,pricePerDay } = req.body
        if ( !brand || !model || !year || !registrationNumber || !location || !description || !vehicleNumber || !pricePerDay) {
            return res.status(400).json({ error: "all fields are required" })
        }
        
        const dealerId= req.user
        console.log(dealerId,"dealers*************")
        if (!dealerId) {
            return res.status(404).json({ error: "Dealer not found" });
        }
        //console.log("Request file:", req.file);
        if (!req.file) {
            return res.status(400).json({ error: "image not found" })
        }




        const cloudinaryRes = await uploadToCloudinary(req.file.path)
        console.log(cloudinaryRes, "image uploaded by cloudinary")

        const newCar = new carDb({
            dealer:dealerId, brand, model, year, registrationNumber, location, image: cloudinaryRes, description, vehicleNumber,pricePerDay
        })

        let savedCar = await newCar.save()

        if (savedCar) {
            return res.status(200).json({ message: "Car details saved************", savedCar })
        }

    } catch (error) {
        console.log(error)
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

const listCars = async (req, res) => {
    try {
        const carList = await carDb.find();
        res.status(200).json({ carList })

    } catch (error) {
        console.log(error)
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

const listBrandorModel = async (req, res) => {
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const carList = await carDb.find(filter);
        res.status(200).json({ carList });

    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
}

const carDetails = async (req, res) => {
    try{
        const userId=req.user
        // const carId = req.params.id
        //const dealerName = req.params.name;
        // if(!carId){
        //     return res.status(400).json({error:"Id not found"})
        // }
        if(!userId){
            return res.status(400).json({error:"Id not found"})
        }
        const carDetail = await carDb.find({ dealer: userId });

    if (!carDetail) {
      return res.status(400).json({ error: "Car not found or you do not have access" });
    }
        return res.status(200).json(carDetail)
    }
    catch(error){
        console.log(error)
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
    

}


const updateCar= async (req,res)=>{
    try {
       const {carId} =req.params
       const{dealer,brand,model,year,registrationNumber,location,description,vehicleNumber,pricePerDay}=req.body
       let imageUrl;
       let isCarExist= await carDb.findById(carId)
       if(!isCarExist){
       return res.status(400).json({error:"Car not found"})
       }
       if(req.file){
        const cloudinaryRes=await uploadToCloudinary(req.file.path)
        imageUrl=cloudinaryRes

       }
       const carUpdated= await carDb.findByIdAndUpdate(carId,{ dealer,brand,year,registrationNumber,location,description,vehicleNumber,pricePerDay,image:imageUrl},{new:true})
res.status(200).json({message:"Car updated",carUpdated})

    } catch (error) {
       console.log(error)
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" }) 
    }
}


const deleteCar=async (req,res)=>{
    try {
        const {carId}=req.params
        const deletedCar=await carDb.findByIdAndDelete(carId)
        if(!deletedCar){
          return  res.status(400).json({error:"Id not found"})
        }
        return res.status(200).json({message:"Car deleted"})
    } catch (error) {
        console.log(error)
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" }) 
    }
}

const setAvailability = async (req, res) => {
    try {
      const carId = req.params.id; // Extract just the ID
      await carDb.findByIdAndUpdate(carId, { availability: false });
      res.json({ message: 'Car marked as unavailable' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update availability' });
    }
  };

  const listOne= async (req,res)=>{
try {
    const carId=req.params.id
    console.log("Incoming carId:", carId);
    const carData= await carDb.findById(carId)
    if (!carData) {
        return res.status(404).json({ error: 'Car not found' });
      }
      return res.status(200).json(carData);
    
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed ' });
}
  }
  
  const getCar= async(req,res)=>{
    try {
        const carId = req.params.id
       // const dealerName = req.params.name;
        if(!carId){
            return res.status(400).json({error:"Id not found"})
        }
        const car= await carDb.findById(carId)

        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }


       return res.status(200).json(car)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed ' });
    }
  }
  

module.exports = {
    create, listCars, carDetails,updateCar,deleteCar,listBrandorModel,setAvailability,listOne,
    getCar
}