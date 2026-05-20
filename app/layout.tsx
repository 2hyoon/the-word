import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "the Word — 오늘의 말씀",
  description: "지금 이 순간 당신에게 필요한 말씀을 뽑아보세요",
  openGraph: {
    title: "the Word — 오늘의 말씀",
    description: "지금 이 순간 당신에게 필요한 말씀을 뽑아보세요",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
    url: "https://theword.app",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
