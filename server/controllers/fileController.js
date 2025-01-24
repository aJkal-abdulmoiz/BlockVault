const fs = require('fs');
const path = require('path');
const { uploadToPinata } = require('../utils/pinata');
const File = require('../models/File');

// Upload file to Pinata and Smart Contract
exports.uploadFile = async (req, res) => {

  try {
    const { walletAddress ,fileName ,file,loggedInuser } = req.body  // Extract walletAddress from the form data
    console.log(walletAddress,fileName,req.user_id)
    // Handle the file upload and storage (e.g., upload to Pinata)
    const unique_filename = `${walletAddress}_${fileName}`;

    const unique_username = `${loggedInuser}`;
    
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
      owner: unique_username, // Assuming user is authenticated
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
    const username = req.headers['x-username'];
    console.log(`fetching files for ${username}`);
    const files = await File.find({ owner: username });
    
    
    res.json({ files });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


exports.updateFileWithId = async (req, res) => {
  try {
    const { cid, loggedInuser, fileId } = req.body;
    console.log("In server")
    console.log(cid, loggedInuser, fileId)

    // Ensure the required fields are provided
    if (!cid || !loggedInuser || !fileId) {
      return res.status(400).json({ message: 'CID, fileId, and logged-in user are required' });
    }

    const fileRecord = await File.findOneAndUpdate(
      { cid },
      { $set: { fileId } },
      { new: true } 
    );
    
    if (!fileRecord) {
      return res.status(404).json({ message: 'User file not found' });
    }
    
    res.status(200).json({ message: 'File updated successfully', fileRecord });

  } catch (error) {
    console.error('Error updating file record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFileWithId = async (req, res) => {
  try {
    const { cid, loggedInuser } = req.body;
    console.log("In server - Delete file");
    console.log(cid, loggedInuser);

    if (!cid || !loggedInuser) {
      return res.status(400).json({ message: 'CID and logged-in user are required' });
    }

    // Delete the file using only `cid` (as per your updated requirement)
    const deletedFile = await File.findOneAndDelete({ cid });

    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found or already deleted' });
    }

    res.status(200).json({ message: 'File deleted successfully', deletedFile });
  } catch (error) {
    console.error('Error deleting file record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




