const adminDb = require("../Models/adminModel");
const bookingModel = require("../Models/bookingModel");
const carModels = require("../Models/carModels");
const dealerModel = require("../Models/dealerModel");
const userModel = require("../Models/userModel");
const { createToken } = require("../utilities/generateToken");
const { hashPassword, comparePassword } = require("../utilities/passwordUtilities");


const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            return res.status(400).json({ error: "all fields are required" });

        }
        const alreadyExist = await adminDb.findOne({ email });
        if (alreadyExist) {
            return res.json(400).json({ error: "already exist" })
        }

        const hashedPassword = await hashPassword(password)

        const newAdmin = new adminDb({
            email, password: hashedPassword
        })
        const saved = await newAdmin.save()
        if (saved) {
            return res.status(200).json({ message: "Admin saved successfully!", saved })
        }
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "all fields are required" })
        }
        const adminExist = await adminDb.findOne({ email })
        if (!adminExist) {
            return res.status(400).json({ error: "Admin not found" })
        }
        const passwordMatch = await comparePassword(password, adminExist.password)
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Password not match!" })
        }
        const token = createToken(adminExist._id, adminExist.role)
        console.log(token, "token")
        res.cookie("token", token)
        return res.status(200).json({ message: "Login successfully!", adminExist, token })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("admin_token")
        res.status(200).json({ message: "Admin Logout Successfully****" })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const profile = async (req, res) => {
    try {
        const admin = await adminDb.findById(req.admin).select("-password");
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json({ admin });
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const updateProfile = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find admin by ID
        const admin = await adminDb.findById(req.admin);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        // Update fields if provided
        if (email) admin.email = email;
        if (password) {
            const hashedPassword = await hashPassword(password);
            admin.password = hashedPassword;
        }

        // Save updated admin
        const updatedAdmin = await admin.save();

        res.status(200).json({
            message: "Admin profile updated successfully!",
            admin: {
                _id: updatedAdmin._id,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
                createdAt: updatedAdmin.createdAt,
                updatedAt: updatedAdmin.updatedAt
            }
        });


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}
//by admin side
const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await userModel.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json({ message: "Deleted" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Failed to delete user" });
    }
  };
  
  const deleteDealer = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await dealerModel.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ error: "Dealer not found" });
      }
  
      return res.status(200).json({ message: "Deleted" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Failed to delete Dealer" });
    }
  };

  // const deleteBooking = async (req, res) => {
  //   try {
  //     userId=req.user
  //     const { id } = req.params;
  //     const deleted = await bookingModel.findByIdAndDelete(id);

  //     car_id=deleted.carId
  //     if(!car_id){
  //       return res.status(404).json({ error: "Car not found" });
  //     }
  //     const available= await carModels.findByIdAndUpdate(car_id,{availability:true})
  //     if(!available){
  //       return res.status(404).json({ error: "Can't change availability" });
  //     }
  
  //     if (!deleted) {
  //       return res.status(404).json({ error: "Booking not found" });
  //     }
  
  //     return res.status(200).json({ message: "Deleted" });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(400).json({ error: "Failed to delete booking" });
  //   }
  // };


  const deleteBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await bookingModel.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ error: "Booking not found" });
      }
  
      const car_id = deleted.carId;
      if (!car_id) {
        return res.status(404).json({ error: "Car not found" });
      }
  
      const available = await carModels.findByIdAndUpdate(car_id, { availability: true });
      if (!available) {
        return res.status(404).json({ error: "Can't change availability" });
      }
  
      return res.status(200).json({ message: "Deleted" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Failed to delete booking" });
    }
  };
  


  
  const getAllCars = async (req, res) => {
      try {
          const cars = await carModels.find(); // exclude password
          res.json({ cars });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to fetch cars' });
      }
  };
  
  const deleteCars= async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await carModels.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ error: "Cars not found" });
      }
  
      return res.status(200).json({ message: "Deleted" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Failed to delete cars" });
    }
  };
  const deactivateBooking= async(req,res)=>{
    try {
        const {id}=req.params
        const booking= await bookingModel.findById(id)
       if (!booking){
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.status="inactive"
      await  booking.save()
      await carModels.findByIdAndUpdate(booking.carId,{availability:true})
      res.status(200).json({ message: 'Booking status and car availability updated' });
        
    } catch (error) {
        console.error(error);
      return res.status(400).json({ error: "Failed to deactivate" });
    }
  }

module.exports = {
    register, login, logout, profile, updateProfile, deleteUser,deleteDealer,deleteBooking,getAllCars,
    deleteCars,deactivateBooking
}