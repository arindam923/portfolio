import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Arindam Roy | Full Stack Developer & Open Source Contributor",
    template: "%s | Arindam Roy",
  },
  description:
    "Full Stack Web Developer & Open Source Contributor. Building scalable web applications and exploring new technologies.",
  keywords: [
    "Arindam Roy",
    "Full Stack Developer",
    "Web Developer",
    "Open Source",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Arindam Roy" }],
  creator: "Arindam Roy",
  metadataBase: new URL("https://arind.space"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arind.space",
    siteName: "Arindam Roy Portfolio",
    title:
      "Arindam Roy | Full Stack Developer & Open Source Contributor",
    description:
      "Full Stack Web Developer & Open Source Contributor. Building scalable web applications and exploring new technologies.",
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "Arindam Roy - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Arindam Roy | Full Stack Developer & Open Source Contributor",
    description:
      "Full Stack Web Developer & Open Source Contributor. Building scalable web applications.",
    images: ["/opengraph.jpg"],
    creator: "@ramxcodes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arindam Roy",
    url: "https://arind.space",
    jobTitle: "Full Stack Developer",
    description:
      "Full Stack Web Developer & Open Source Contributor based in India",
    sameAs: [
      "https://github.com/arindam923",
      "https://x.com/mars87153",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-zinc-500/30`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              classNames: {
                toast:
                  "border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl",
                description: "text-zinc-400",
                actionButton: "bg-zinc-100 text-zinc-900",
                cancelButton: "bg-zinc-800 text-zinc-100",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
