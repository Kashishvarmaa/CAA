import React, { useState } from "react";
import axios from "axios";

const Form = ({ setResult }) => {
    const [colors, setColors] = useState({
        skin: "",
        eyes: "",
        lips: "",
        hair: "",
    });

    const handleChange = (e) => {
        setColors({ ...colors, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/analyze", colors);
            setResult(response.data.analysis);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(colors).map((field) => (
                <div key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                    <input
                        type="text"
                        name={field}
                        value={colors[field]}
                        onChange={handleChange}
                        placeholder="#hexcode"
                        required
                    />
                </div>
            ))}
            <button type="submit">Analyze</button>
        </form>
    );
};

export default Form;