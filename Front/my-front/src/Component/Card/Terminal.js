import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/Terminal.css';

export default function TerminalComponent({ idMachine }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();

    const command = input;

    if (command === 'clear') {
      setOutput([]);
    } else {
      try {
        const response = await axios.post(`${apiUrl}/execute-command/${idMachine}`, {
          command,
        });

        setOutput([...output, { command, result: response.data }]);
      } catch (error) {
        console.error('Error executing command:', error);
      }
    }

    setInput('');
  };

  const handleTerminalClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="terminal" onClick={handleTerminalClick}>
      <div className="terminal-output">
        {output.map((item, index) => (
          <div key={index}>
            <span className="prompt">$ {item.command}</span>
            <div className="output">{item.result}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleInputSubmit} className="terminal-input">
        <span className="prompt">$ </span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          ref={inputRef}
        />
      </form>
    </div>
  );
}
