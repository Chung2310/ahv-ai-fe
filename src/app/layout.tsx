import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SmoothScroll from '@/components/Effects/SmoothScroll';
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AHV AI | Nền tảng API AI mạnh mẽ",
  description: "Hệ sinh thái AI mạnh mẽ nhất dành cho nhà phát triển. Tích hợp các mô hình AI tiên tiến chỉ trong vài phút.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
