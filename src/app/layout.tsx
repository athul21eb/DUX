import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import AllProviders from "@/components/layouts/allProviders";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  title: {
    default: "DUX - Professional Mentorship Platform",
    template: "%s | DUX",
  },
  description: "Find the perfect mentor to guide your career journey and achieve your professional goals.",
  keywords: ["mentorship", "career guidance", "professional development", "coaching", "India"],
  authors: [{ name: "DUX Team" }],
  creator: "DUX",
  publisher: "DUX",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default  function RootLayout({
  children,modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {




  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
        <AllProviders>{children}
        { modal} {/* Ensures the modal slot is rendered */}
        </AllProviders>
      </body>
    </html>
  );
}
