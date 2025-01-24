import { ethers } from 'ethers';
const FileRegistryABI = require('./ABI.json'); // Replace with your ABI JSON file
const contractAddress = '0xA4c97E152526E9f17D04751b39735180A1E8Ad8b';

// Helper function to get contract instance
export const getContractInstance = async () => {
    if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
    
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          return new ethers.Contract(contractAddress, FileRegistryABI, signer);
          console.log('Connected Account:', accounts[0]);
    
          // Example usage of signer
          console.log('Signer Address:', await signer.getAddress());
    
          return accounts[0];
        } catch (error) {
          console.error('Failed to connect wallet', error);
          throw new Error('Failed to connect wallet');
        }
      } else {
        console.log('Please install MetaMask!');
        throw new Error('MetaMask not installed');
      }
    
    
};

// Upload file to the smart contract
export const uploadFileToSmartContract = async (cid, fileName) => {
    try {
        const contract = await getContractInstance();

        // Send the transaction to upload the file
        const tx = await contract.uploadFile(cid, fileName);
        console.log('Transaction sent:', tx);

        // Listen for the FileUploaded event
        contract.once('FileUploaded', (fileId, fileName, owner) => {
            console.log('FileUploaded event:', fileId, fileName, owner);
            // Capture the fileId from the event
            const fileIdString = fileId.toString();
            console.log('Captured File ID:', fileIdString);

            // You can return or save the fileId here
            return fileIdString;
        });

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt);
    } catch (error) {
        console.error('Error uploading file to smart contract:', error);
        throw new Error('Smart contract upload failed');
    }
};




// Grant access to a user
export const grantAccess = async (fileId, walletAddress) => {
    try {
        const contract = await getContractInstance();
        const tx = await contract.grantAccess(fileId, walletAddress);
        await tx.wait();
        console.log(`Access granted to ${walletAddress}`);
    } catch (error) {
        console.error('Error granting access:', error);
        throw new Error('Failed to grant access');
    }
};

// Revoke access from a user
export const revokeAccess = async (fileId, walletAddress) => {
    try {
        const contract = await getContractInstance();
        const tx = await contract.revokeAccess(fileId, walletAddress);
        await tx.wait();
        console.log(`Access revoked from ${walletAddress}`);
    } catch (error) {
        console.error('Error revoking access:', error);
        throw new Error('Failed to revoke access');
    }
};

// Check if a user has access
export const hasAccess = async (fileId, userAddress) => {
    try {
        const contract = await getContractInstance();
        return await contract.hasAccess(fileId, userAddress);
    } catch (error) {
        console.error('Error checking access:', error);
        throw new Error('Failed to check access');
    }
};

// Fetch File CID
export const getFileCIDbyFId = async (fileId) => {
    try {
        const contract = await getContractInstance();
        const cid = await contract.getFileCID(fileId);
        console.log(cid)
        return cid;
    } catch (error) {
        console.error('Error fetching file CID:', error);
        throw new Error('Failed to fetch file CID');
    }
};
// Fetch File CID by File Name
export const getFileCIDbyName = async (fileName) => {
    try {
        const contract = await getContractInstance();
        const cid = await contract.getFileCID(fileName); // Using the new contract function
        return cid;
    } catch (error) {
        console.error('Error fetching file CID:', error);
        throw new Error('Failed to fetch file CID');
    }
};

