import { useState } from 'react'
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));

import './App.css'

const MAX_CHUNK_SIZE = 1900; // Maximum size of each chunk

function App() {
  const [file, setFile] = useState(null);
  const [chunks, setChunks] = useState([]);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    setChunks([]);
  }

  const parseFile = async () => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target.result;
      const numChunks = Math.ceil(content.length / MAX_CHUNK_SIZE);
      const newChunks = [];
      for (let i = 0; i < numChunks; i++) {
        const start = i * MAX_CHUNK_SIZE;
        const end = (i + 1) * MAX_CHUNK_SIZE;
        const chunk = content.substring(start, end);
        newChunks.push(chunk);
      }
      setChunks(newChunks.map((chunk) => ({ text: chunk, preview: chunk.split(' ').slice(0, 5).join(' '), copied: false })));
    };

    reader.readAsText(file);
  };

  const copyToClipboard = async (chunkIndex) => {
    try {
      await navigator.clipboard.writeText(chunks[chunkIndex].text);
      const newChunks = [...chunks];
      newChunks[chunkIndex] = { ...newChunks[chunkIndex], copied: true };
      setChunks(newChunks);
    } catch (err) {
      console.error(err);
    }
  }

    const reloadPage = () => {
      window.location.reload();
    };
  

  return (
    <div className="App">
      <div className="header">
        <h3>✂️ ChatGPT Document Parser </h3>
        <h4>Upload a .txt file then click parse to break file it into chunks under 2K characters.</h4>

        <input type="file" onChange={handleFileUpload} />
        {file && <button onClick={parseFile}>Parse File</button>}
        {file && <button onClick={reloadPage}>Reload App</button>}

        
      </div>
      <div className="grid-container">
        {chunks.map((chunk, index) => (
          <div className="grid-item" key={index} style={{ backgroundColor: "#f2f2f2" }}>
            {!chunk.copied ? (
              <>
                <p style={{ fontWeight: "bold" }}>{`Chunk ${index + 1}`}</p>
                <p>{chunk.preview}</p>
                <button onClick={() => copyToClipboard(index)}> 📋 Copy</button>
              </>
            ) : (
              <>
                <p style={{ fontWeight: "bold", color: "green" }}>✅ Copied to clipboard</p>
                <p>{chunk.preview}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
