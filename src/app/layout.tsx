import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SplashScreen } from "@/components/layout/SplashScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Travixa | Travel Intelligence. Perfected.",
  description: "Enterprise AI Travel Operating System & Package Builder",
  manifest: "/manifest.json",
  icons: {
    icon: "/travixa-logo.png",
    shortcut: "/travixa-logo.png",
    apple: "/travixa-logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${sora.variable} font-sans min-h-screen bg-[#0F172A] pb-24 md:pb-0 selection:bg-primary/30 overflow-x-hidden`}>
        <SplashScreen />
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen bg-grid-pattern relative">
            {/* Fading overlay to keep grid subtle */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#0F172A_95%)] pointer-events-none z-0" />
            <div className="relative z-10">{children}</div>
          </main>
          <MobileNav />
        </SmoothScroll>
      </body>
    </html>
  );
}
