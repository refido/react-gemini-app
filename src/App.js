import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "When is Sunday?",
    "What is the capital of France?",
    "What is the weather in London?",
    "How many people live in New York?",
    "What is the population of China?",
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  }

  const getResponse = async () => {
    if (!value) {
      setError("Please enter a question!");
      return;
    }
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory(oldChatHistory => [...oldChatHistory,
      { role: "user", parts: value },
      { role: "model", parts: data }
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("There was an error fetching the data.");
    }
  }

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  }

  return (
    <div className="app">
      <p>Hi there! What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me!</button>
      </p>
      <div className="input-container">
        <input value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="When is Sunday...?" />
        {!error && <button onClick={getResponse}>Ask me!</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-results">
        {chatHistory.map((chatItem, _index) =>
          <div key={_index}>
            <p className="answer">{chatItem.role} : {chatItem.parts}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
