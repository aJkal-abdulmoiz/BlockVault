import { ethers } from 'ethers';
const FileRegistryABI = require('./ABI.json')

// Connect to Ethereum provider
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract('0x0Bc72619B74eE4C3e82E5C02Ec29fC72F8C7627B', FileRegistryABI, signer);

// Upload file to the smart contract
export const uploadFileToSmartContract = async (cid, fileName) => {
    const tx = await contract.uploadFile(cid, fileName);
    await tx.wait();
    console.log('File uploaded successfully to the smart contract');
};

// Grant Access to a user
export const grantAccess = async (fileId, walletAddress) => {
    const tx = await contract.grantAccess(fileId, walletAddress);
    await tx.wait();
    console.log(`Access granted to ${walletAddress}`);
};

// Revoke Access from a user
export const revokeAccess = async (fileId, walletAddress) => {
    const tx = await contract.revokeAccess(fileId, walletAddress);
    await tx.wait();
    console.log(`Access revoked from ${walletAddress}`);
};

// Check if the user has access
export const hasAccess = async (fileId, userAddress) => {
    return await contract.hasAccess(fileId, userAddress);
};

// Fetch File CID
export const getFileCID = async (fileId) => {
    const cid = await contract.getFileCID(fileId);
    return cid;
};
