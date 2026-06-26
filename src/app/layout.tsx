import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusAI — Next-Gen AI Automation Platform",
  description:
    "NexusAI is the world's most powerful AI automation platform. Automate workflows, integrate seamlessly, and scale your business with intelligent AI agents that work 24/7.",
  keywords:
    "AI automation, artificial intelligence, workflow automation, machine learning, SaaS, enterprise AI, NexusAI",
  authors: [{ name: "NexusAI Team" }],
  openGraph: {
    title: "NexusAI — Next-Gen AI Automation Platform",
    description:
      "Automate workflows, integrate seamlessly, and scale your business with intelligent AI agents that work 24/7.",
    type: "website",
    url: "https://nexusai.vercel.app",
    siteName: "NexusAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexusAI — AI Automation Platform Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusAI — Next-Gen AI Automation Platform",
    description:
      "Deploy intelligent AI agents that automate your most complex workflows. Trusted by 50,000+ teams.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* JetBrains Mono — Headers */}
        {/* Inter — Body */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#172B36" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
