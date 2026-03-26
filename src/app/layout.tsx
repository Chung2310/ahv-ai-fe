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
  title: "AHV AI | Powerful AI API Platform",
  description: "The most powerful AI ecosystem for developers. Integrate advanced AI models in minutes.",
  keywords: ["AI", "API", "Artificial Intelligence", "Machine Learning", "AHV AI", "Flux", "Claude", "GPT"],
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
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning translate="no">
      <body className={plusJakartaSans.className} suppressHydrationWarning>
        <AppEffects>
          {children}
        </AppEffects>
      </body>
    </html>
  );
}



