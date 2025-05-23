import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { Providers } from "./providers";

const onest = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${onest.className} bg-zinc-950 text-zinc-100 selection:bg-orange-500 selection:text-white antialiased`}
      >
        <Providers>
          <Toaster richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
