import express from "express";
import {register } from "../controler/userControler.js";

const router = express.Router();

router.post("/register", register);


export default router;
