import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../db/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const chatWithAI = async (req, res) => {
  const { userMessage, userId } = req.body; // Include userId for tracking conversations

  try {
    // Fetch last 5 messages for context
    const [previousMessages] = await db.execute(
      "SELECT user_message, bot_response FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [userId]
    );

    // Format conversation history
    let chatHistory = previousMessages.map(msg => `User: ${msg.user_message}\nBot: ${msg.bot_response}`).join("\n");
    chatHistory += `\nUser: ${userMessage}`;

    // Generate AI response using chat history
    const result = await model.generateContent(chatHistory);
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    // Save the new message and response to the database
    await db.execute(
      "INSERT INTO messages (user_id, user_message, bot_response) VALUES (?, ?, ?)",
      [userId, userMessage, responseText]
    );

    res.json({ botResponse: responseText });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
