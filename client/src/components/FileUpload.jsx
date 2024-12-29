import React, { useState } from "react";
import axios from "axios";
import { connectToBlockchain, getContractInstance } from "../utils/blockchain"; // Import blockchain functions
import contractABI from "../contracts/FileUpload.sol/FileUpload.json";


const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const contractAddress = "0xYourSmartContractAddress"; // Your contract address

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!file) {
      setMessage("Please select a file.");
      setLoading(false);
      return;
    }

    try {
      // Connect to blockchain (e.g., MetaMask)
      const { signer } = await connectToBlockchain();
      if (!signer) throw new Error("Blockchain connection failed.");

      // Get contract instance
      const contract = getContractInstance(contractAddress, contractABI, signer);

      // Upload file to IPFS (assumed this is a separate function in your utils/ipfs)
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Assuming the contract has a storeFile function to store file metadata on-chain
      const tx = await contract.storeFile(file.name, res.data.file.ipfsHash); 
      await tx.wait(); // Wait for the transaction to be mined

      setMessage(`File uploaded successfully! Transaction Hash: ${tx.hash}`);
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
          {loading ? "Uploading..." : "Upload to Blockchain"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
