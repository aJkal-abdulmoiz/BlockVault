// Import ethers from Hardhat
const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's wallet
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Compile and get the contract
    const FileUpload = await ethers.getContractFactory("FileUpload");

    // Deploy the contract
    const fileUpload = await FileUpload.deploy();
    console.log("FileUpload contract deployed to:", fileUpload.address);
}

// Execute the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
