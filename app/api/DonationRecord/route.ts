import { NextResponse } from "next/server";
import { ethers } from "ethers";
import donationABI from "@/blockchain/artifacts/contracts/DonationRecords.sol/DonationRecords.json";

// Ensure environment variables are set
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DONATION_CONTRACT;
const PROVIDER_URL = process.env.ALCHEMY_SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Validate environment variables
if (!CONTRACT_ADDRESS || !PROVIDER_URL || !PRIVATE_KEY) {
  console.error("❌ Missing required environment variables!");
  throw new Error("Missing required environment variables!");
}

/**
 * Creates a new contract instance.
 */
const getContract = () => {
  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, donationABI.abi, wallet);
};

/**
 * GET: Fetch all donation records
 */
export async function GET() {
  try {
    console.log("📌 Fetching all donation records...");
    const contract = getContract();
    const donations = await contract.getDonations();

    // Transform response: Convert BigInt values to strings
    const formattedDonations = donations.map((donation: { donorId: bigint, date: string, bloodUnitId: BigInt }) => ({
      donorId: donation.donorId.toString(),
      date: donation.date,
      bloodUnitId: donation.bloodUnitId.toString(),
    }));

    console.log("✅ Retrieved donations:", formattedDonations);
    return NextResponse.json({ donations: formattedDonations });
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to retrieve donations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST: Add a new donation
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Received payload:", body);

    const { donorId, date, bloodUnitId } = body;

    // Validate payload
    if (donorId === undefined || !date || bloodUnitId === undefined) {
      console.error("❌ Missing fields:", { donorId, date, bloodUnitId });
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("🚀 Submitting donation:", { donorId, date, bloodUnitId });

    // Parse values correctly
    const parsedDonorId = BigInt(donorId);
    const parsedBloodUnitId = BigInt(bloodUnitId);
    console.log("🆔 Parsed IDs:", { parsedDonorId, parsedBloodUnitId });

    const contract = getContract();
    const tx = await contract.addDonation(parsedDonorId, date, parsedBloodUnitId);
    console.log("📡 Transaction sent, waiting for confirmation... Hash:", tx.hash);

    await tx.wait();
    console.log("✅ Transaction confirmed!");

    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("❌ Error adding donation:", error);
    return NextResponse.json(
      { error: "Failed to add donation", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}