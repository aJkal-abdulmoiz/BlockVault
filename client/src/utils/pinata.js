const fetch = require('node-fetch');
const FormData = require('form-data');

// const PINATA_API_KEY = process.env.PINATA_API_KEY;
// const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

const uploadToPinata = async (file) => {
  const form = new FormData();

  // Append the file to FormData
  form.append('file', file.buffer, file.originalname);  // Use file's original name

  // Prepare the options with the required headers and form as the body
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,  // Authentication header
      ...form.getHeaders(),  // FormData headers automatically added here (including boundary)
    },
    body: form,  // Body set to the FormData
  };

  try {
    // Send the request to Pinata API
    const response = await fetch('https://uploads.pinata.cloud/v3/files', options);
    const data = await response.json();

    // Check if the response is successful and extract the CID
    if (response.ok) {
      return {
        cid: data.IpfsHash,  // Pinata's IPFS hash (CID)
        fileName: file.originalname,  // Filename for reference
        contentType: file.mimetype,  // MIME type of the uploaded file
      };
    } else {
      throw new Error(`Pinata upload failed: ${data.error}`);
    }
  } catch (err) {
    console.error('Pinata upload failed:', err);
    throw new Error('Failed to upload file to Pinata');
  }
};

module.exports = { uploadToPinata };
