const validateFile = (file) => {
    // Example of a simple file validation function
    if (!file || !file.name || !file.size) {
      throw new Error('Invalid file');
    }
    return true;
  };
  
  module.exports = { validateFile };
  