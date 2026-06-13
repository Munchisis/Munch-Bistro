import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js'
import 'dotenv/config.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

//app config
const app = express()
const port = process.env.PORT || 4000

// db connection
connectDB();

// CORS dynamic origin whitelist
const allowedOrigins = [
  "https://munch-bistro-frontend.onrender.com", 
  "https://munch-bistro-admin.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
      credentials: true, // Enabled for cookies/sessions if needed
};


// middleware
app.use(express.json())
app.use(cors(corsOptions))


//api endpoints
app.use("/api/food", foodRouter)
app.use('/images', express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// Root Endpoint
app.get("/", (req, res)=>{
    res.send("API is working")
})

// Start Server
app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
