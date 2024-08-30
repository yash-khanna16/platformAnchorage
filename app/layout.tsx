import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import favicon from '@/app/favicon.png'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anchorage",
  description: "A hotel Management website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href={favicon.src} />
      </head>
      <body className={inter.className}>{children}

<Script async src="https://www.googletagmanager.com/gtag/js?id=G-5XLZK2PKC8"></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
                        declare global {
                            interface Window { dataLayer: any[]; }
                        }
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){window.dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-GQHCS09DEW');
                    `}
        </Script>
      </body>

    </html>
  );
}
