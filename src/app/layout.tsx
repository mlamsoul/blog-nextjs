import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Satisfy,
} from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Michel's personal blog",
  description:
    "Michel's personal blog about programming, technology, and other stuff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-gray-100">
        <div className="flex-1 flex justify-center px-4 py-12">
          <div className="w-full max-w-5xl bg-[#1a1a1a] rounded-xl shadow-xl px-8 py-10 min-h-screen">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
