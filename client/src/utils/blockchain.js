import { ethers } from "ethers";

const connectToBlockchain = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BaseWallet(window.ethereum);
      const signer = provider.getSigner();
      await provider.send("eth_requestAccounts", []); // Request user accounts
      return { provider, signer };
    } catch (error) {
      throw new Error("User rejected the connection request or MetaMask is not responding.");
    }
  } else {
    throw new Error("Ethereum provider not found. Please install MetaMask or a compatible wallet.");
  }
};

const getContractInstance = (contractAddress, contractABI, signer) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
};

export { connectToBlockchain, getContractInstance };
