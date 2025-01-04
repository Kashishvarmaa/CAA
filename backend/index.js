const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const portfinder = require("portfinder");
require("dotenv").config();

// Import utilities
const { analyzeColors, getRecommendations } = require("./utils");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// // Helper function to call the OpenAI API
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
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "gpt-3.5-turbo",
                prompt: prompt,
                max_tokens: 200,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        return response.data.choices[0].text.trim();
    } catch (error) {
        if (error.response) {
            console.error("Error response from API:", error.response.data);
        } else {
            console.error("Error message:", error.message);
        }
        throw new Error("Failed to get recommendations.");
    }
};

// Endpoint for LLM-based analysis
app.post("/analyze", async (req, res) => {
    const { skin, eyes, lips, hair } = req.body;

    if (!skin || !eyes || !lips || !hair) {
        return res.status(400).json({ error: "All color inputs are required." });
    }

    try {
        const analysis = await callLLM({ skin, eyes, lips, hair });
        res.json({ success: true, analysis });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint for mock analysis
app.post("/mock-analyze", (req, res) => {
    const { skinColor, eyeColor, lipColor, hairColor } = req.body;

    if (!skinColor || !eyeColor || !lipColor || !hairColor) {
        return res.status(400).json({ error: "All color inputs are required." });
    }

    // Use mock utilities
    const palette = analyzeColors(skinColor, eyeColor, lipColor, hairColor);
    const advice = getRecommendations(palette);

    res.status(200).json({ palette, advice });
});

// Start the server with `portfinder`
portfinder.getPort((err, port) => {
    if (err) throw err;

    app.listen(port, () => {
        console.log(`Backend running on port ${port}`);
    });
});