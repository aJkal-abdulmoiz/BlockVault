// utils/pinata.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

const uploadToPinata = async (file) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(file));

    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
            headers: {
                ...form.getHeaders(),
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET,
            },
        });

        return response.data.IpfsHash; // CID
    } catch (err) {
        console.error('Pinata upload failed:', err);
        throw new Error('Failed to upload file to Pinata');
    }
};

module.exports = { uploadToPinata };
