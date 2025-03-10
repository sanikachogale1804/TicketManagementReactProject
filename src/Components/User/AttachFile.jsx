import React, { useState } from 'react';

const AttachFile = () => {
  const [files, setFiles] = useState([]);
  const [fileStatus, setFileStatus] = useState("");  // To show feedback to user

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles([...files, ...selectedFiles]); // Add the selected files to state
  };

  const handleFileSubmit = (event) => {
    event.preventDefault();

    // Simulate file upload (this should be replaced with actual file upload logic)
    if (files.length === 0) {
      setFileStatus("No files selected.");
    } else {
      setFileStatus("Files submitted successfully.");
      console.log("Files to upload:", files);
      // Upload files to backend here
    }
  };

  return (
    <div className="attach-file">
      <h2>Attach Files</h2>
      <input 
        type="file" 
        multiple 
        onChange={handleFileChange} 
      />
      <button onClick={handleFileSubmit}>Submit Files</button>
      <p>{fileStatus}</p>
    </div>
  );
};

export default AttachFile;
