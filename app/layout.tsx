import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUXYN — Space to do your best work",
  description:
    "LUXYN leases private, design-led suites to independent beauty and wellness professionals — the freedom to build, serve, and grow in an elevated space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
