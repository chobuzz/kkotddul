import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisitorTracker from "@/components/VisitorTracker";

export const metadata: Metadata = {
  title: "천연쟁이 꽃뜰 - 치유 농업 & 원예 힐링",
  description: "자연과 함께하는 치유 농업, 원예 힐링 프로그램 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <VisitorTracker />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
