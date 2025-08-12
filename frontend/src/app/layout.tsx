import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { LanguageProvider } from "../lib/language-context";

const notoSans = Noto_Sans({ 
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans"
});

export const metadata: Metadata = {
  title: "PlantDex - Plant Market Intelligence Platform",
  description: "The Stock Market for Plants - Real-time pricing, trends, and market intelligence for Thailand's plant industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-lang="en">
      <body className={`${notoSans.className} ${notoSans.variable}`}>
        <LanguageProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
