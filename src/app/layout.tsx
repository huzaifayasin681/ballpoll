import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/components/cart/cart-context";
import { SplashLoader } from "@/components/layout/splash-loader";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — The Clubhouse · 8 Ball Pool Coins, Cues & Boosting`,
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
  themeColor: "#0F3D2E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream font-sans text-ink selection:bg-brass/30">
        <SplashLoader />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
