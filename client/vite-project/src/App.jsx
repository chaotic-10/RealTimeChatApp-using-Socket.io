// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SERVER_ENDPOINT = 'http://localhost:3000';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SERVER_ENDPOINT);
    setSocket(newSocket);
  
    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    newSocket.on('welcome', (welcomeMessage) => {
      setMessages((prevMessages) => [...prevMessages, welcomeMessage]);
    });
  
    newSocket.on('userJoined', (userJoinedMessage) => {
      setMessages((prevMessages) => [...prevMessages, userJoinedMessage]);
    });
  
    newSocket.on('userLeft', (userLeftMessage) => {
      setMessages((prevMessages) => [...prevMessages, userLeftMessage]);
    });
  
    return () => {
      newSocket.disconnect();
      setMessages([]); // Clear messages array on component unmount or socket disconnection
    };
  }, []);

  const handleMessageSend = () => {
    if (inputValue.trim() !== '') {
      socket.emit('sendMessage', inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#0e0e10", color: "#fff", fontFamily: "Arial, sans-serif" }}>
      <div style={{ padding: "20px", border: "1px solid #fff", borderRadius: "10px", marginBottom: "20px", maxWidth: "500px", width: "90%", background: "#222", boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)" }}>
        <h1 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px", color: "#ffa500" }}> Dev Space</h1>
        <div style={{ borderRadius: "10px", background: "#222", padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
          {messages.map((message, index) => (
            <div key={index} style={{ margin: "5px", whiteSpace: "pre-wrap", fontSize: "16px", lineHeight: "1.5", color: "#fff" }}>{message}</div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ flex: "1", marginRight: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #fff", backgroundColor: "#222", color: "#fff", fontFamily: "Arial, sans-serif", fontSize: "16px" }}
            placeholder="Type your message..."
          />
          <button onClick={handleMessageSend} style={{ padding: "10px 20px", borderRadius: "5px", border: "none", backgroundColor: "#ffa500", color: "#000", cursor: "pointer", fontFamily: "Arial, sans-serif", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", transition: "background-color 0.3s" }}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
