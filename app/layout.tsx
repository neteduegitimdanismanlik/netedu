import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConsentGate from "./components/ConsentGate";
import RenewGate from "./components/RenewGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NetEdu — Get into your dream university",
  description:
    "Personalized university guidance for IB students — roadmap, coursework marking, university matching and portfolio in one place.",
  verification: {
    google: "mtxxfRJz2SvLtjwVv6ryxB7iP_g0lYVbYEMqKex95Ss",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConsentGate />
        <RenewGate />
        {children}
      </body>
    </html>
  );
}
