import type { Metadata } from "next";
import "./globals.css";
import { AlgebraProvider } from "@/context/AlgebraProvider";

export const metadata: Metadata = {
  title: "UMG Programms",
  description: "UMG Programs ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AlgebraProvider>{children}</AlgebraProvider>
      </body>
    </html>
  );
}
