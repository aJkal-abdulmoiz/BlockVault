const { uploadFileToIPFS } = require('../utils/ipfs');
const { uploadFileToBlockchain } = require('../utils/blockchain'); // Using Ethers.js
const File = require('../models/File'); // MongoDB model for file metadata

const uploadFile = async (req, res) => {
  try {
    const file = req.file; // Assuming file is sent via multipart form data
    const ipfsHash = await uploadFileToIPFS(file);
    
    // Store file metadata in MongoDB
    const newFile = new File({
      name: file.originalname,
      ipfsHash: ipfsHash
    });

    await newFile.save();

    // Upload file to the blockchain
    const blockchainTxHash = await uploadFileToBlockchain(ipfsHash);

    // Save blockchain transaction hash in MongoDB
    newFile.blockchainTxHash = blockchainTxHash;
    await newFile.save();

    res.status(200).json({
      message: "File uploaded successfully!",
      file: newFile
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};

module.exports = { uploadFile };
