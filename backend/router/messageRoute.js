import express from "express";
import { getAllMessages, sendMessage } from "../controler/messageController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", getAllMessages);

export default router;
