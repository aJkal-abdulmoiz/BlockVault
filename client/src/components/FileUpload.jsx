import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Get the wallet address from localStorage
    const walletAddress = localStorage.getItem('walletAddress');
    console.log(walletAddress)
    
    if (!file || !walletAddress) {
      setMessage('Please select a file and ensure wallet address is available.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // Append file to FormData
    formData.append('walletAddress', walletAddress);  // Append wallet address from localStorage to FormData

    try {
      // Step 1: Upload file to backend (which will handle Pinata upload)
      const res = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Ensure multipart form-data for file upload
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Authorization token
        },
      });

      // If transaction was successful
      if (res.data.transactionHash) {
        console.log('Transaction successful');
        console.log('Transaction Hash:', res.data.transactionHash);
        console.log('Block Number:', res.data.blockNumber);

        alert(`File uploaded successfully!\nTransaction Hash: ${res.data.transactionHash}\nBlock Number: ${res.data.blockNumber}`);
      }

      setMessage(`File uploaded successfully! CID: ${res.data.cid}`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>File Upload</h1>
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}  // Handle file change
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
      {message && <p>{message}</p>}  {/* Display messages */}
    </div>
  );
};

export default FileUpload;
