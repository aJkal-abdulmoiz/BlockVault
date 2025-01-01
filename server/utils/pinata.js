const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

exports.uploadToPinata = async (filePath) => {
  try {
    const form = new FormData();
    const fileStream = fs.createReadStream(filePath);

    // Get the file size for the Upload-Length header
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;

    // Append the file to the form data
    form.append('file', fileStream);

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`, // Pinata JWT Token
      'Upload-Length': fileSizeInBytes, // Add the Upload-Length header
      ...form.getHeaders(), // Automatically include the necessary FormData headers
    };

    // Make the request to Pinata API using axios
    const response = await axios.post('https://uploads.pinata.cloud/v3/files', form, { headers });

    console.log(response.data); // Check the full response structure
    const cid = response.data?.cid || response.data?.data?.cid;
    console.log(cid); // Log the CID
    return cid;
    
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw new Error('Pinata upload failed');
  }
};
