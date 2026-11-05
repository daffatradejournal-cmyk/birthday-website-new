import type { Metadata } from "next";
import "./globals.css";
import GrainOverlay from "@/components/GrainOverlay";

export const metadata: Metadata = {
  title: "Selamat Ulang Tahun, Sayang ♡ | A Secret Birthday Scrapbook",
  description: "A soft, intimate digital scrapbook and interactive birthday experience.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎂</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-alabaster text-espresso font-sans antialiased selection:bg-dusty-rose/30 selection:text-espresso relative overflow-x-hidden">
        {/* Subtle CSS noise / paper grain overlay across viewport */}
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
