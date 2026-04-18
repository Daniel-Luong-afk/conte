import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import NotificationBell from "./components/NotificationBell";
import NavAuth from "./components/NavAuth";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Conte",
  description: "Read translated novels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <nav className="border-b border-gray-800 bg-gray-950 px-4 py-3 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link
                href="/"
                className="font-bold text-lg text-white tracking-tight hover:text-indigo-400 transition-colors"
              >
                Conte
              </Link>
              <div className="flex items-center gap-5">
                <Link
                  href="/browse"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Browse
                </Link>
                <Link
                  href="/library"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Library
                </Link>
                <NotificationBell />
                <NavAuth />
              </div>
            </div>
          </nav>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
