// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileUpload {
    string public uploadedFileHash;

    // Function to upload a file (storing the file hash)
    function uploadFile(string memory fileHash) public {
        uploadedFileHash = fileHash;
    }

    // Function to retrieve the uploaded file hash
    function getFile() public view returns (string memory) {
        return uploadedFileHash;
    }
}
