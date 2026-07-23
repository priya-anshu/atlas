import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";
import { siteUrl } from "./site";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Atlas",
  title: {
    default: "Atlas | Study Library",
    template: "%s | Atlas",
  },
  description: "A focused study library for notes, formulas, and previous-year questions.",
  keywords: ["study notes", "physics formulas", "PYQ", "revision", "Atlas"],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/atlas-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/atlas-icon.svg"],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Atlas",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#101419" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
