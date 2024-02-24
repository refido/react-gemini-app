import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "How do you think advancements in artificial intelligence will impact the job market in the next decade?",
    "What are some of the most pressing environmental issues facing the world today, and what can individuals do to help address them?",
    "In what ways do you think technology has changed the way people communicate and form relationships?",
    "What are your thoughts on the ethical implications of genetic engineering and designer babies?",
    "In what ways can we improve access to quality education for underserved communities, especially in regions with limited resources?",
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
      const baseUrl = "https://react-gemini-app.vercel.app";
      const endpoint = "/gemini";
      const response = await fetch(baseUrl + endpoint, options);
      const data = await response.text();
      console.log(data);
      setChatHistory(oldChatHistory => [...oldChatHistory,
      { role: "You", parts: value },
      { role: "Gemini", parts: data }
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
      <div className="chat">
        <div className="chat-bubble">
          <p className="role">Gemini:</p>
          <p className="item">Hi there! What do you want to know?
            <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me!</button>
          </p>
        </div>
      </div>

      <div className="input-container">
        <span className="icon">
          <FaSearch />
        </span>
        <input value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="When is Sunday...?" />
        {!error && <button onClick={getResponse}><IoMdSend /></button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>

      {error && <div className="error-message"><p>{error}</p></div>}

      <div className="search-results">
        {chatHistory.map((chatItem, _index) =>
          <div className="chat-item" key={_index}>
            <p className="role">{chatItem.role}</p>
            <p className="parts">{chatItem.parts}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
