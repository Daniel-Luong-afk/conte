import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
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
          <nav className="border-b px-4 py-3 bg-white dark:bg-gray-900 dark:border-gray-800">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <a
                href="/"
                className="font-bold text-lg hover:opacity-70 transition-opacity"
              >
                Conte
              </a>
              <div className="flex items-center gap-4">
                <a
                  href="/browse"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Browse
                </a>
              </div>
            </div>
          </nav>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
