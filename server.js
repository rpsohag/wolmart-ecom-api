import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import permissionRoute from "./routes/permissionRoute.js";
import roleRoute from "./routes/roleRoute.js";
import mongoDBConnect from "./config/db.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.static("public"));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/permission", permissionRoute);
app.use("/api/v1/auth", roleRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  mongoDBConnect();
  console.log(`Server listening on port ${PORT}`);
});
