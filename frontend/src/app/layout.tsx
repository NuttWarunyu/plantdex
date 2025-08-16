import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/language-context";
import { UserProvider } from "@/lib/user-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlantDex - ปล่อยต้นไม้หาบ้านใหม่",
  description: "แพลตฟอร์มปล่อยต้นไม้หาบ้านใหม่ เชื่อมต่อคนรักต้นไม้",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <LanguageProvider>
          <UserProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
