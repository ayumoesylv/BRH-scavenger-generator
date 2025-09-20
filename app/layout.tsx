import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus Scavenger Generator",
  description: "Generate location-specific scavenger hunt items with Gemini.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">{children}</body>
    </html>
  );
}
