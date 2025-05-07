const express=require("express")
const cors = require('cors');
const cookieparser=require("cookie-parser")
const { connectionDB } = require("./config/db");
const apiRouter = require("./Routes");
const DealerRoutes = require("./Routes/dealerRoutes");
const carRouter = require("./Routes/carRoutes");
const { bookingRouter } = require("./Routes/bookingRoutes");
const reviewRouter = require("./Routes/reviewRoutes");
const app=express();
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true })) // ✅ important for form-data parsing

const allowedOrigins = [
    'http://localhost:5173',
    'https://car-rental-frontend-amber.vercel.app'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
  }));
  

    app.use(cookieparser());
    connectionDB();

    app.use("/api",apiRouter)
    app.use("/api/v1",DealerRoutes)
    app.use("/api/v1/cars",carRouter)
    app.use("/api/v1/booking",bookingRouter)
    app.use("/api/v1/review",reviewRouter)




app.get("/",(req,res)=>{
res.send("hello world")
})




const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`server is runnig on http://localhost:${port}`)
})