const userDb = require("../Models/userModel");
const { createToken } = require("../utilities/generateToken");
const {hashPassword,comparePassword} = require("../utilities/passwordUtilities");



const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, contactNumber } = req.body;

        if (!name || !email || !password || !confirmPassword  || !contactNumber) {
            return res.status(400).json({ error: "all fields are required" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords dosnot match" })
        }
        const userExist = await userDb.findOne({ email })
        if (userExist) {
            return res.status(400).json({ error: "Email already exist" })
        }

        const hashedPassword = await hashPassword(password)



        const newUser = new userDb({
            name, email, password: hashedPassword, contactNumber
        })
        const saved = await newUser.save()
        if (saved) {
            const token=createToken(saved._id)
            console.log(token,"token")
            res.cookie("token",token)
            return res.status(200).json({ message: "User created" })
        }

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const login = async (req, res) => {
    try {

        const {email,password}=req.body;
        if(!email || !password){
           return res.status(400).json({error:"all fields are required"})
        }
        const userExist= await userDb.findOne({email})
        if(!userExist){
            return res.status(400).json({error:"User not found"})
        }
        const passwordMatch= await comparePassword(password,userExist.password)
        console.log(passwordMatch);
        if(!passwordMatch){
            return res.status(400).json({error:"Password not match!"})
        }
        const token=createToken(userExist._id)
        console.log(token,"token")
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "None", // Needed for cross-origin
            secure: true,     // Must be true when sameSite is 'None'
          });
        return res.status(200).json({message:"Login successfully!",userExist,token})


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}


const profile=async(req,res)=>{
    try {
        const user = await userDb.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const updateProfile= async (req,res)=>{
    try {
        
        const { name,email,password,contactNumber} = req.body;

        // Find admin by ID
        const user = await userDb.findById(req.user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update fields if provided
        if (name) user.name = name;
        
        if (email) user.email = email;

        if (password) {
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword;
        }
        if (contactNumber) user.contactNumber = contactNumber;

        // Save updated admin
        const updatedUser= await user.save();

        res.status(200).json({
            message: "User profile updated successfully!",
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
                contactNumber:updatedUser.contactNumber,
            }
        });


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}


const logout=async(req,res)=>{
  try {
      res.clearCookie("token")
      res.status(200).json({message:"User Logout Successfully****"})
      
  } catch (error) {
      console.log(error);
      res.status(error.status || 500).json({ error: error.message || "internal server error" })
  }
}

const deleteuser= async (req,res)=>{
    try {
        const deletedUser = await userDb.findByIdAndDelete(req.user);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.clearCookie('token'); // Optional: Clear auth cookie on deletion
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await userDb.find({}, '-password'); // exclude password
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};



module.exports = {
    register,login,profile,updateProfile,logout,deleteuser,getAllUsers
}