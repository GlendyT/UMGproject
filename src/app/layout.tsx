import type { Metadata } from "next";
import "./globals.css";
import { AlgebraProvider } from "@/context/AlgebraProvider";
import { MatematicaDiscretaProvider } from "@/context/MatematicaDiscretaProvider";

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
        <AlgebraProvider>
          <MatematicaDiscretaProvider>{children}</MatematicaDiscretaProvider>
        </AlgebraProvider>
      </body>
    </html>
  );
}
