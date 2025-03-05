import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/navbar";


export const metadata: Metadata = {
  title: "Blood Donation",
  description: "Blood Donation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  </>
  );
}
