// utils.js

// Mock function for analyzing colors
function analyzeColors(skinColor, eyeColor, lipColor, hairColor) {
    // Return predefined palettes for now
    return {
        warm: ["#FF5733", "#FFC300"],
        cool: ["#33AFFF", "#335BFF"],
        neutral: ["#D3D3D3", "#A9A9A9"]
    };
}

// Mock function for LLM-like beauty advice
function getRecommendations(palette) {
    // Generate a mock response based on the palette
    return `Based on the provided colors, use warm tones like ${palette.warm.join(
        ", "
    )} for a vibrant look, and cool tones like ${palette.cool.join(
        ", "
    )} for a sophisticated style.`;
}

module.exports = { analyzeColors, getRecommendations };