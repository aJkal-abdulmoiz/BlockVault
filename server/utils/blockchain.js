// Load environment variables
require('dotenv').config();

// Import ethers
const { ethers } = require("ethers");

// Set up Infura provider
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);

// Set up signer with the private key (NEVER commit your private key directly)
const signer = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY, provider);

// Contract details
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('../contractABI.json'); // Import ABI

// Initialize contract with signer
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Function to upload file to the blockchain (example)
const uploadFileToBlockchain = async (fileName) => {
  try {
    const tx = await contract.uploadFile(fileName);
    await tx.wait(); // Wait for the transaction to be mined
    return tx.hash;
  } catch (error) {
    console.error("Error uploading file to blockchain:", error);
    throw new Error("Blockchain transaction failed.");
  }
};

module.exports = { uploadFileToBlockchain };
