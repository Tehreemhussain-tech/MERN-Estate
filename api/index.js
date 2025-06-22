import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'
import listingRouter from './routes/listingRoute.js'
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected to MongoDB!');   
})
.catch((err)=>{
    console.log(err); 
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// using express -> to create express app
const app = express();

app.use(express.json()); //allow json as an input of the server.
//app gives methods to use -> listen port

// cookie-parser
app.use(cookieParser());

app.listen(3000, () =>{
    console.log("Server is running on port 3000");
})

// use api route
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


/* ---------- ERROR HANDLING COMING FROM MIDDLEWARE------------------------------------------- */
//middleware

//next-> go to next middleware
//err -> error -> coming from input of this middleware.
app.use((err, req, res, next)=>{
    //statuscode get from err middleware.
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message,
    });
});