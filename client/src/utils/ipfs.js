import axios from 'axios';

export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    headers: {
      'pinata_api_key': 'your_pinata_api_key',
      'pinata_secret_api_key': 'your_pinata_secret_api_key',
    },
  });

  return res.data.IpfsHash; // Returns the hash of the uploaded file
};
