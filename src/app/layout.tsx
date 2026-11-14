import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/components/cart/cart-context";
import { SplashLoader } from "@/components/layout/splash-loader";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Buy 8 Ball Pool Coins, Cash, Cues & Boosting`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "8 ball pool coins",
    "buy 8 ball pool coins",
    "8 ball pool cash",
    "legendary cues",
    "8 ball pool accounts",
    "8 ball pool boosting",
    "archangel cue",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#141413",
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('gps_theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <SplashLoader />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
