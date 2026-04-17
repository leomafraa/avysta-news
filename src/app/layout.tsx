import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Avysta News — Notícias de Construção Civil no Brasil",
    template: "%s | Avysta News",
  },
  description:
    "Portal de notícias especializado em construção civil no Brasil. Acompanhe as últimas notícias sobre materiais, mercado imobiliário, infraestrutura, tecnologia e financiamento.",
  keywords: [
    "construção civil",
    "notícias construção",
    "mercado imobiliário",
    "materiais de construção",
    "infraestrutura brasil",
    "engenharia civil",
    "incorporação imobiliária",
    "financiamento habitacional",
  ],
  authors: [{ name: "Avysta" }],
  creator: "Avysta",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Avysta News",
    title: "Avysta News — Notícias de Construção Civil no Brasil",
    description:
      "Portal de notícias especializado em construção civil no Brasil.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avysta News",
    description: "Notícias de construção civil no Brasil",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  var p = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  if (t === 'dark' || (!t && p === 'dark')) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
