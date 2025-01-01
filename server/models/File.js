const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  cid: { type: String, required: true },
  fileName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const File = mongoose.model("File", FileSchema);

module.exports = File;
