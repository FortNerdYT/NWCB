import 'dotenv/config';
import OpenAI from "openai";
import express from 'express';

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable provided by Vercel

alert(port);

const token = process.env.GITHUB_TOKEN;

const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token
});

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle chat requests
app.post('/api/generate', async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
    }

    try {
        const response = await client.chat.completions.create({
            messages: messages,
            model: "gpt-4o",
            temperature: 1,
            max_tokens: 4096,
            top_p: 1
        });

        // Send the response back to the client
        res.json({ output: response.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});

// Serve static files (for the frontend)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});