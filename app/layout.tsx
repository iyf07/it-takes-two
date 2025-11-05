import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import NavigationBar from "@/components/NavBar";
import CurrencyBar from "@/components/CurrencyBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        {children}
        <CurrencyBar />
      </body>
    </html>
  );
}
