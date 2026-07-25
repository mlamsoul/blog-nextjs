import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Michel's personal blog",
    template: "%s | Michel's personal blog",
  },
  icons: {
    icon: "/images/logo.svg",
  },
  description:
    "Michel's personal blog about programming, technology, and other stuff.",
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: "https://blog.lamsoul.be",
    siteName: "Michel's personal blog",
    title: "Michel's personal blog",
    description:
      "Michel's personal blog about programming, technology, and other stuff.",
    images: [
      {
        url: "https://blog.lamsoul.be/og-image.png",
        width: 1200,
        height: 630,
        alt: "Michel's personal blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
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
