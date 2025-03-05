import { ethers } from "hardhat";

async function main() {
  const DonorRegistry = await ethers.getContractFactory("DonorRegistry"); // Get the contract factory
  const donorRegistry = await DonorRegistry.deploy(); // Deploy contract
  const DonationRecords = await ethers.getContractFactory("DonationRecords"); // Get the contract factory
  const donationRecords = await DonationRecords.deploy(); // Deploy contract
  

  await donorRegistry.waitForDeployment(); // Wait for deployment to complete
  await donationRecords.waitForDeployment(); // Wait for deployment

  console.log("DonorRegistry deployed to:", await donorRegistry.getAddress()); // Get contract address
  console.log("DonationRecords deployed to:", await donationRecords.getAddress()); // Get contract address
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});