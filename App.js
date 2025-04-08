import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>AI-Powered Career Mentor</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload Resume</button>

      {analysis && (
        <div>
          <h3>Analysis</h3>
          <pre>{analysis}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
