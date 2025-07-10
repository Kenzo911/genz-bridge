import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import DonationSection from "@/components/DonationSection";
import ReportFeedback from "@/components/ReportFeedback";

const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gen Z Bridge - Connect with Your Gen Z Kids",
  description: "AI-powered insights to help parents understand and connect with Gen Z children through slang translation and cultural context.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <QueryProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <DonationSection />
          </div>
          <ReportFeedback />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
