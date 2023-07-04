import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.js';
import userRoute from './routes/userRoute.js'
import mongoDBConnect from "./config/db.js"
const app = express();
dotenv.config()

const PORT = process.env.PORT || 5000




app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/api/v1/user', userRoute)

app.use(errorHandler)

app.listen(PORT, () => {
    mongoDBConnect()
    console.log(`Server listening on port ${PORT}`);
})