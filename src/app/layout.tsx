import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AppEffects from '@/components/Providers/AppEffects';
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AHV AI | Nền tảng API AI mạnh mẽ",
  description: "Hệ sinh thái AI mạnh mẽ nhất dành cho nhà phát triển. Tích hợp các mô hình AI tiên tiến chỉ trong vài phút.",
  keywords: ["AI", "API", "Trí tuệ nhân tạo", "Machine Learning", "AHV AI", "Flux", "Claude", "GPT"],
  openGraph: {
    title: "AHV AI | Premium AI API Platform",
    description: "Scale your ambition with AHV AI.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <AppEffects>
          {children}
        </AppEffects>
      </body>
    </html>
  );
}



