// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const nunito = Nunito_Sans({
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
      <body className={nunito.className}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
