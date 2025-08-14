
import type { Metadata } from "next";
import "./globals.css";
import { AlgebraProvider } from "@/context/AlgebraProvider";
import { MatematicaDiscretaProvider } from "@/context/MatematicaDiscretaProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

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
          <MatematicaDiscretaProvider>{children}

            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
          </MatematicaDiscretaProvider>
        </AlgebraProvider>
      </body>
    </html>
  );
}
