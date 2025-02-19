import express from 'express';
import cors from 'cors';
import chatbotRoutes from './Routes/chatbotRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
