const dealerDb = require("../Models/dealerModel");
const { createToken } = require("../utilities/generateToken");
const { hashPassword, comparePassword } = require("../utilities/passwordUtilities");

const register = async (req, res) => {

    try {

        const { name, email, password, confirmPassword, contactNumber, carId, role } = req.body;
        if (!name || !email || !password || !confirmPassword || !contactNumber || !carId) {
            return res.status(400).json({ error: "All fields are required!" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords dosnot match" })
        }
        const userExist = await dealerDb.findOne({ email })
        if (userExist) {
            return res.status(400).json({ error: "Already exist!" })
        }

        const hashedPassword = await hashPassword(password)

        const newUser = new dealerDb({
            name, email, password: hashedPassword, contactNumber, carId, role
        })
        const saved = await newUser.save()
        if (saved) {
            const token = createToken(saved._id)
            console.log(token, "token")
            res.cookie("token", token)
            return res.status(200).json({ message: "Dealer regitered successfully", saved })
        }

    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }



}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields required!" })
        }

        const userExist = await dealerDb.findOne({ email })
        if (!userExist) {
            return res.status(400).json({ error: " Dealer Not Found" })
        }
        const passwordMatch = await comparePassword(password, userExist.password)
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: "password not match!" })
        }
        const token = createToken(userExist._id, userExist.role)
        console.log("token", token)
        //   res.cookie("token",token)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({ message: "Login successfully!", userExist, token })
    }
    catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const profile = async (req, res) => {
    try {
        const dealer = await dealerDb.findById(req.user).select("-password");
        if (!dealer) {
            return res.status(404).json({ error: "Dealer not found" });
        }

        res.status(200).json({ dealer });
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}


const updateProfile = async (req, res) => {
    try {

        const { name, email, password, contactNumber, vehicleNumber } = req.body;

        // Find admin by ID
        const dealer = await dealerDb.findById(req.user);
        if (!dealer) {
            return res.status(404).json({ error: "Admin not found" });
        }

        // Update fields if provided
        if (name) dealer.name = name;
        if (email) dealer.email = email;
        if (password) {
            const hashedPassword = await hashPassword(password);
            dealer.password = hashedPassword;
        }
        if (contactNumber) dealer.contactNumber = contactNumber;
        if (vehicleNumber) dealer.vehicleNumber = vehicleNumber;

        // Save updated admin
        const updatedDealer = await dealer.save();

        res.status(200).json({
            message: "Dealer profile updated successfully!",
            dealer: {
                _id: updatedDealer._id,
                name: updatedDealer.name,
                email: updatedDealer.email,
                password: updatedDealer.password,
                contactNumber: updatedDealer.contactNumber,
                vehicleNumber: updatedDealer.vehicleNumber,
                role: updatedDealer.role,
                createdAt: updatedDealer.createdAt,
                updatedAt: updatedDealer.updatedAt
            }
        });


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ message: "Dealer Logout Successfully****" })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}
const getAllDealers = async (req, res) => {
    try {
        const dealers = await dealerDb.find({}, '-password'); // exclude password
        res.json({ dealers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

module.exports = {
    register,
    login, profile, updateProfile, logout, getAllDealers
}