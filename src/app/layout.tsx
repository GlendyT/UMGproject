import type { Metadata } from "next";
import "./globals.css";
import { AlgebraProvider } from "@/context/AlgebraProvider";
import { MatematicaDiscretaProvider } from "@/context/MatematicaDiscretaProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { PrecalculoProvider } from "@/context/PrecalculoProvider";

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
          <MatematicaDiscretaProvider>
            <PrecalculoProvider>
              {children}

              <GoogleAnalytics gaId="G-4DQL7T0JLJ" />
              <GoogleTagManager gtmId="GTM-TG63XJCB" />
            </PrecalculoProvider>
          </MatematicaDiscretaProvider>
        </AlgebraProvider>
      </body>
    </html>
  );
}
