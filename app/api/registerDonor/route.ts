import { NextResponse } from "next/server";
import { ethers } from "ethers";
import donorRegistryABI from "@/blockchain/artifacts/contracts/DonorRegistry.sol/DonorRegistry.json";

// Ensure environment variables are available
const PRIVATE_KEY = process.env.PRIVATE_KEY as string | undefined;
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL as string | undefined;
const NEXT_PUBLIC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string | undefined;

// Validate environment variables
if (!PRIVATE_KEY || !ALCHEMY_SEPOLIA_URL || !NEXT_PUBLIC_CONTRACT_ADDRESS) {
  console.error("❌ Missing required environment variables.");
  throw new Error("Server misconfiguration: Environment variables are missing");
}

/**
 * Initializes and returns an ethers contract instance.
 */
const getContract = () => {
  const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL!);
  const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
  return new ethers.Contract(NEXT_PUBLIC_CONTRACT_ADDRESS!, donorRegistryABI.abi, wallet);
};

/**
 * Validates request payload for donor registration.
 */
const validateInput = (body: { name?: string; bloodType?: string }) => {
  if (!body.name || !body.bloodType) {
    throw new Error("❌ Missing required fields: name, bloodType");
  }
};

/**
 * Checks if the wallet has enough ETH for gas fees.
 */
const checkGasBalance = async (wallet: ethers.Wallet, provider: ethers.JsonRpcProvider) => {
  const balance = await provider.getBalance(wallet.address);
  if (balance < ethers.parseEther("0.005")) {
    throw new Error(`❌ Insufficient ETH. Balance: ${ethers.formatEther(balance)} ETH`);
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    validateInput(body);

    console.log(`📌 Registering donor: ${body.name}`);

    // Initialize contract
    const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL!);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(NEXT_PUBLIC_CONTRACT_ADDRESS!, donorRegistryABI.abi, wallet);

    await checkGasBalance(wallet, provider);

    // Execute transaction
    const tx = await contract.registerDonor(body.name, body.bloodType);
    console.log("✅ Transaction sent:", tx.hash);

    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
    return NextResponse.json({ error: (error as Error).message || "Registration failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log("📌 Fetching all donors...");

    const contract = getContract();
    const donors = await contract.getAllDonors();

    // Transform the response to a readable format
    const formattedDonors = donors.map((donor: { name: string; bloodType: string }) => ({
      name: donor.name,
      bloodType: donor.bloodType,
    }));

    console.log("✅ Retrieved donors:", formattedDonors);

    return NextResponse.json({ donors: formattedDonors });
  } catch (error) {
    console.error("❌ Error fetching donors:", (error as Error).message);
    return NextResponse.json({ error: "Failed to retrieve donors" }, { status: 500 });
  }
}