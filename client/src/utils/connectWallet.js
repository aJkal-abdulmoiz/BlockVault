import { ethers } from 'ethers';

// Connect to wallet (MetaMask)
export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
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
  

// Disconnect from wallet (clear user session or reset state)
export const disconnectWallet = () => {
  console.log('Disconnected from wallet');
  // You can add additional logic for disconnecting here, if needed
};
