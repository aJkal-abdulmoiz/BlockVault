const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  blockchainTxHash: { type: String }
});

module.exports = mongoose.model('File', fileSchema);
