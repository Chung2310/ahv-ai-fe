import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import BackgroundEffects from "@/components/BackgroundEffects/BackgroundEffects";
import PlexusBackground from '@/components/BackgroundEffects/PlexusBackground';
import SmoothScroll from '@/components/Effects/SmoothScroll';
import CustomCursor from '@/components/Effects/CustomCursor';
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PiAPI | AI-Powered API Platform",
  description: "The most powerful AI APIs for developers. Integrate state-of-the-art AI models in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <CustomCursor />
        <SmoothScroll>
          <PlexusBackground />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
