const fs = require('fs');
const path = require('path');
const { uploadToPinata } = require('../utils/pinata');
const File = require('../models/File');
const { ethers } = require('ethers');

// Upload file to Pinata and Smart Contract
exports.uploadFile = async (req, res) => {

  try {
    
    const { walletAddress ,fileName ,file } = req.body  // Extract walletAddress from the form data

    // Handle the file upload and storage (e.g., upload to Pinata)
    const unique_filename = `${walletAddress}_${fileName}`;
    
    // // Ensure the wallet address is valid
    // if (!ethers.utils.isAddress(walletAddress)) {
    //   return res.status(400).send("Invalid wallet address");
    // }

    // Save the uploaded file to a temporary directory and get the file path
    const tempFilePath = "../uploads/Cool Cat.png"
    

    // Upload file to Pinata and get CID
    const cid = await uploadToPinata(tempFilePath);
    Unique_cid = cid
    console.log(`File Unique Cid is ${Unique_cid}`)

    // Save the file metadata in MongoDB
    const newFile = new File({
      fileName: unique_filename,
      cid: cid,
      owner: "Abdulmoiz", // Assuming user is authenticated
    });

    await newFile.save();
    
    res.json({
      msg: 'File uploaded successfully',
      cid: cid
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


// Get files uploaded by user
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: 'Abdulmoiz' });
    res.json({ files });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
