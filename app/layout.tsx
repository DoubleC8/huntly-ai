import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Huntly AI",
  description: "AI-powered job tracking to streamline your search.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ReactQueryProvider>
          {children}
          <Toaster position="bottom-right" richColors expand={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
