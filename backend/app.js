import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRoute.js";

const app = express();
dotenv.config({ path: "./config/config.env" });
//  console.log(process.env.PORT)

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// but for production level use multer

/**
 * Multer
 * Multer is more powerful and configurable, making it a great choice for handling file uploads
 * if you need more control over how files are stored,
 * validated, or processed. However, the setup is a bit more involved.
 *
 **/
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/message", messageRouter);

dbConnection();
// app.use(errorMiddleware());  //this will throw an error
app.use(errorMiddleware); //note the way to use errormiddleware
export default app;
