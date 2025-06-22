import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MoveiBot from "@/components/MoveiBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoveiHub - Stream Your Favorite Movies & TV Shows",
  description: "Discover and stream the latest movies and TV shows. Watch trailers, read reviews, and find your next favorite entertainment on MoveiHub.",
  keywords: "movies, tv shows, streaming, entertainment, trailers, reviews",
  authors: [{ name: "MoveiHub Team" }],
  openGraph: {
    title: "MoveiHub - Stream Your Favorite Movies & TV Shows",
    description: "Discover and stream the latest movies and TV shows on MoveiHub.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <MoveiBot />
      </body>
    </html>
  );
}
