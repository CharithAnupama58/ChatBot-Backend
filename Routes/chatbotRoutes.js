import express from "express";
import { chatWithAI } from "../Controller/chatbotController.js";

const router = express.Router();

// Define chatbot API route
router.post("/chat", chatWithAI);

export default router;
