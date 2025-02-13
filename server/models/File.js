const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  cid: { type: String, required: true },
  fileId: { type: String},
  fileName: { type: String, required: true },
  owner: { type: String , required: true},
});

const File = mongoose.model("File", FileSchema);

module.exports = File;
