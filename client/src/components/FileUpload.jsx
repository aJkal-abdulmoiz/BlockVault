import React, { useState } from 'react';
import axios from 'axios';
import { getContractInstance } from '../utils/ContractFunctions';
const FormData = require('form-data');

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState(null); // State to store the fileId

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Get the wallet address and logged-in user from localStorage
    const walletAddress = localStorage.getItem('walletAddress');
    const loggedInuser = localStorage.getItem('loggedInuser');
    
    console.log("walletAddress: ", walletAddress); // Debugging line
    console.log("loggedInuser: ", loggedInuser); // Debugging line
    
    if (!file || !walletAddress || !loggedInuser) {
      setMessage('Please select a file and ensure wallet address and logged-in user are available.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('walletAddress', walletAddress);

    // Prepare the body object for file upload
    const body = {
      file: formData,
      fileName: file.name,
      walletAddress: walletAddress,
      loggedInuser: loggedInuser
    };

    try {
      // Step 1: Upload the file to Pinata through the backend
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/files/upload',
        data: body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in headers
        }
      });

      console.log("Backend response:", response.data); // Debugging line

      if (response.data) {
        const { cid } = response.data;
        console.log(`File uploaded to Pinata. CID: ${cid}`);

        // Step 2: Upload the file's CID to the smart contract and capture the fileId
        const contract = await getContractInstance();
        const tx = await contract.uploadFile(cid, file.name);
        console.log('Transaction sent:', tx);

        // Return a promise that resolves once the FileUploaded event is fired
        contract.once('FileUploaded', (fileId, fileName, owner) => {
          console.log('FileUploaded event:', fileId, fileName, owner);
          
          // Capture the fileId from the event
          const fileIdString = fileId.toString();
          console.log('Captured File ID:', fileIdString);

          // Set the fileId in the state
          setFileId(fileIdString);

          // Step 3: Save fileId along with logged-in user to the backend
          const body = {
            cid: cid,
            fileId: fileIdString,
            loggedInuser: loggedInuser,
            fileName:file.name,
          };

          axios.post('http://localhost:5000/api/files/savefileid', body, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          }).then((response) => {
            console.log("File ID saved to backend:", response.data); // Debugging line
            setMessage(`File uploaded successfully! CID: ${cid} FileID: ${fileIdString}`);
            alert(`File uploaded successfully!\nCID: ${cid} FileID: ${fileIdString}`);
          }).catch((err) => {
            console.error("Error saving file ID:", err);
            setMessage('Error saving file ID to backend.');
          });

        });

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt);

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
