import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import MobileNav from "@/components/layouts/MobileNav";
import { inter } from "@/lib/fonts";

export const metadata = {
  title: "PayTrack",
  description: "Track your expenses and income",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MobileNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
