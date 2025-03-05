"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BloodType, bloodTypeOptions } from "@/types/eBloodType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RegisterDonorForm = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [donorId, setDonorId] = useState("");
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState<BloodType | "">("");
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      });

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet.");
    } finally {
      setConnecting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    if (!donorId || !name || !bloodType) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("/api/registerDonor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId, name, bloodType, walletAddress: account }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Donor registered successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error registering donor:", error);
      alert("Something went wrong. Check the console.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 p-6 bg-white shadow-lg rounded-xl">
      {!isConnected && (
        <Button onClick={connectWallet} disabled={connecting} type="button">
          {connecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}
      <Input
        type="text"
        placeholder="Donor ID"
        value={donorId}
        onChange={(e) => setDonorId(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Donor Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        value={bloodType}
        onChange={(e) => setBloodType(e.target.value as BloodType)}
        required
        className="p-2 border rounded"
      >
        <option value="">Select Blood Type</option>
        {bloodTypeOptions.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={!isConnected}>
        Register Donor
      </Button>
    </form>
  );
};

export default RegisterDonorForm;