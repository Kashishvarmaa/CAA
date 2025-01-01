import React, { useState } from "react";
import Header from "./components/Header";
import Form from "./components/Form";
import Result from "./components/Result";

const App = () => {
    const [result, setResult] = useState("");

    return (
        <div>
            <Header />
            <Form setResult={setResult} />
            {result && <Result result={result} />}
        </div>
    );
};

export default App;