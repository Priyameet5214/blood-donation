"use client";

import { MetaMaskProvider as MetaMaskContextProvider } from "@metamask/sdk-react";
import { FC } from "react";

interface MetaMaskProviderProps {
  children: React.ReactNode;
}

const MetaMaskProvider: FC<MetaMaskProviderProps> = ({ children }) => {
  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Blood Donation DApp",
      url: `https://${host}`,
    },
  };

  return (
    <MetaMaskContextProvider debug={false} sdkOptions={sdkOptions}>
      {children}
    </MetaMaskContextProvider>
  );
};

export default MetaMaskProvider;