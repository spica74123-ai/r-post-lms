import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./Providers";
import { Sarabun } from "next/font/google";

const sarabun = Sarabun({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "R-POST | Royal Thai Army LMS",
  description: "Enterprise-level Learning Management System for the Royal Thai Army",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${sarabun.variable} font-sans bg-gray-50 dark:bg-army-900 text-gray-900 dark:text-white min-h-screen antialiased transition-colors`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
