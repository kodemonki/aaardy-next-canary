import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const experimental_ppr = true;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jelly Belly Bean Explorer",
  description: "Explore and discover Jelly Belly jelly bean flavors with filtering, sorting, and detailed information about ingredients and dietary options.",
  keywords: ["jelly belly", "jelly beans", "flavors", "candy", "sweets", "gluten free", "sugar free", "kosher"],
  authors: [{ name: "Jelly Belly Explorer" }],
  openGraph: {
    title: "Jelly Belly Bean Explorer",
    description: "Discover your favorite Jelly Belly jelly bean flavors",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
