import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";

export const metadata: Metadata = {
  title: "Kizuna Sonic",
  description: "Bridging the silence between deaf owners and blind dogs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
