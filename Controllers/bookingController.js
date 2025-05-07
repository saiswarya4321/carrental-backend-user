const express = require('express');
const bookingDb = require('../Models/bookingModel');
const carModels = require('../Models/carModels');
const bookingModel = require('../Models/bookingModel');
const router = express.Router();



// const create = async (req, res) => {
//     try {
//       const booking = new bookingDb(req.body);
//       await booking.save();
//       return res.status(201).json({ success: true, bookingDb: booking });
//     } catch (error) {
//       console.error("Booking save error:", error.message);
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   };
const create = async (req, res) => {
  try {
    const { userId, carId, model, days, totalAmount, sessionId } = req.body;

    // Validate required fields
    if (!userId || !carId || !model || !days || !totalAmount) {
      console.error("Missing fields:", { userId, carId, model, days, totalAmount });
      return res.status(400).json({ success: false, message: "Missing required booking data" });
    }

    // const existing = await bookingDb.findOne({ carId });
    // if (existing) {
    //   return res.status(409).json({ success: false, message: "You have already booked this car." });
    // }


    const booking = new bookingDb({ userId, carId, model, days, totalAmount, paymentStatus: "completed", status: "active", sessionId });
    await booking.save();

    await carModels.findByIdAndUpdate(carId, { availability: false });

    return res.status(201).json({ success: true, bookingDb: booking });
  } catch (error) {
    console.error("Booking save error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listbooking = async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await bookingDb.findById(carId);

    if (!car) {
      return res.status(400).json({ error: "Car not found" });
    }

    return res.json(car);

  } catch (error) {
    console.error("Booking fetch error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getUserBooking = async (req, res) => {
  try {
    const userId = req.user;  // Assuming you're using JWT for authentication and storing user in req.user

    // Fetch the booking details based on the userId
    const bookings = await bookingDb.find({ userId: userId }).populate('carId'); // Populate car details

    if (bookings.length === 0) { // Check if no bookings were found
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    // Send back the bookings along with the car info
    return res.json(bookings);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


const getDealerBooking = async (req, res) => {
  try {
    const userId = req.user;

    const cars = await carModels.find({ dealer: userId });
    if (!cars || cars.length === 0) {
      return res.status(404).json({ error: "Cars not found!" });
    }

    const carsId = cars.map(car => car._id); 
    const bookedCars = await bookingModel.find({ carId: { $in: carsId } });

    return res.json(bookedCars);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};



const deletebooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user;  // Assuming you're using JWT and have user ID in req.user

  try {
    const booking = await bookingDb.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    booking.status = 'inactive';
    await booking.save();

    const carId = booking.carId;
    await carModels.findByIdAndUpdate(carId, { availability: true });

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBooking = async (req, res) => {
  try {
    const booking = await bookingDb.find();
    res.json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = {
  create, listbooking, getUserBooking, deletebooking, getAllBooking,getDealerBooking
}
