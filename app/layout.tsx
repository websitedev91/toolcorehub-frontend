// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Toolcorehub",
  description: "Free online tools by Toolcorehub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0F172A]`}>
        {/* Fixed top nav */}
        <SiteHeader />

        {/* Dashboard shell: sidebar + main */}
        <div className="flex pt-16 min-h-screen">
          {/* Fixed left sidebar */}
          <Sidebar />

          {/* Scrollable main content */}
          <main className="ml-64 flex-1 min-h-full bg-[#0F172A]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
