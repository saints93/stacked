import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "STACKED",
  description: "Private client reference site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-wf-page="67f7843114cd419492b96127"
      data-wf-site="67f7843014cd419492b960d7"
      suppressHydrationWarning
    >
      <head>
        {/* Global no-index for privacy */}
        <meta name="robots" content="noindex,nofollow" />

        {/* Webflow CSS */}
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/webflow.css" />
        <link rel="stylesheet" href="/css/stacked-run.webflow.css" />

        {/* Favicon / webclip from Webflow export */}
        <link
          href="/images/favicon.svg"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link href="/images/webclip.svg" rel="apple-touch-icon" />
      </head>
      <body suppressHydrationWarning>
        <div className="page-wrapper">
          <Navbar />
          <main className="main-wrapper">{children}</main>
          <Footer />
        </div>

      </body>
    </html>
  );
}
