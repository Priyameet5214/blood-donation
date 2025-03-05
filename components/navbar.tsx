"use client";

import useWallet from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavBar = () => {
  const { account, isConnected, connectWallet, disconnectWallet, connecting } = useWallet();

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
      {/* Logo */}
      <Link href="/" className="flex px-2 md:gap-1 md:px-6">
        <span className="hidden text-2xl font-bold sm:block">
          <span className="text-[#0C200A]">Blood</span>
          <span className="text-[#4C6D07]">Donation</span>
        </span>
      </Link>

      {/* Wallet Connection */}
      {isConnected ? (
        <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
          <span className="text-gray-700 font-medium">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <Button variant="destructive" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={connecting}
          className="px-5 py-2 text-white bg-green-600 hover:bg-green-700 transition rounded-lg"
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </nav>
  );
};

export default NavBar;