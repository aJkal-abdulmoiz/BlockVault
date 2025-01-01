import React, { useState } from 'react';
import axios from 'axios';
import { uploadFileToSmartContract } from '../utils/ContractFunctions';

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
    if (!file || !walletAddress) {
      setMessage('Please select a file and ensure wallet address is available.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('walletAddress', walletAddress);

    try {
      // Step 1: Upload the file to Pinata through the backend and save record to MONGODB for platform proof
      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        const { cid } = response.data;
        console.log(`File uploaded to Pinata. CID: ${cid}`);

        // Step 2: Upload the file's CID to the smart contract
        let transaction_info = await uploadFileToSmartContract(cid, file.name);
        console.log(transaction_info.blockNumber);
        console.log(transaction_info.transactionHash);
        
        

        setMessage(`File uploaded successfully! CID: ${cid}`);
        alert(`File uploaded successfully!\nCID: ${cid}`);
      } else {
        throw new Error('Failed to retrieve CID from the backend response.');
      }
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
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
