const File = require('../models/File');
const pinata = require('../utils/pinata');  // Assuming you have a pinata utility to handle file uploads to Pinata
const { ethers } = require('ethers');
const path = require('path');
const FileRegistryABI = require(path.join(__dirname, '../utils/ABI.json'));

// Upload File to Pinata and Smart Contract
exports.uploadFile = async (req, res) => {
  try {
    const { fileName, file, walletAddress } = req.body; // walletAddress is passed from frontend

    // Ensure the wallet address is valid
    if (!ethers.utils.isAddress(walletAddress)) {
      return res.status(400).send("Invalid wallet address");
    }

    // Upload file to Pinata and get CID
    const cid = await pinata.uploadToPinata(file);

    // Save the file metadata in MongoDB
    const newFile = new File({
      fileName,
      cid,
      owner: req.user.id, // Assuming user is authenticated
    });

    await newFile.save();

    // Setup provider and signer using wallet address
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const signer = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY, provider);  // Using the private key from .env
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, FileRegistryABI, signer);

    // Upload file CID to Smart Contract
    const tx = await contract.uploadFile(cid, fileName, { from: walletAddress });
    const receipt = await tx.wait(); // Wait for the transaction to be mined

    // Return success response
    res.json({ 
      msg: 'File uploaded successfully', 
      file: newFile,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


getFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id });
    res.json({ files });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = { uploadFile , getFiles }