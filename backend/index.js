const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Helper function to call the OpenAI API
const callLLM = async (inputs) => {
    const { skin, eyes, lips, hair } = inputs;

    const prompt = `
        Based on the given hex codes:
        Skin Color: ${skin}, Eye Color: ${eyes}, Lip Color: ${lips}, Hair Color: ${hair},
        Recommend:
        1. A suitable color palette (warm, cool, or neutral).
        2. Matching foundation shades.
        3. Lipstick color recommendations.
        4. Hair color options.
        5. Accessory suggestions.
        6. Beauty advice.
    `;

    try {
        const response = await axios.post("https://api.openai.com/v1/completions", {
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 200,
            temperature: 0.7,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error calling LLM:", error.message);
        throw new Error("Failed to get recommendations.");
    }
};

// Endpoint to handle color analysis
app.post("/analyze", async (req, res) => {
    const { skin, eyes, lips, hair } = req.body;

    try {
        const analysis = await callLLM({ skin, eyes, lips, hair });
        res.json({ success: true, analysis });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server with `portfinder`
const portfinder = require('portfinder');

portfinder.getPort((err, port) => {
    if (err) throw err; // Handle error if `portfinder` fails
    app.listen(port, () => {
        console.log(`Backend running on port ${port}`);
    });
});