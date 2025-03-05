"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

const useWallet = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
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
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  return { account, isConnected, connectWallet, connecting, disconnectWallet };
};

export default useWallet;