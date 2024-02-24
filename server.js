require('dotenv').config();

const port = process.env.EXPRESS_PORT || 8080;
const express = require('express');
const cors = require('cors');
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/gemini', async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);
    const text_model = genAI.getGenerativeModel({ model: process.env.MODEL_TEXT_to_TEXT });

    const chat = text_model.startChat({ history: req.body.history });
    const message = req.body.message;

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.send(text);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});