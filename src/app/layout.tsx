import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { CartStoreRehydrate } from "@/components/CartStoreRehydrate";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hakuna Bolas de Arroz — Menú",
  description: "Menú digital. Pedido y checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartStoreRehydrate />
        {children}
      </body>
    </html>
  );
}
