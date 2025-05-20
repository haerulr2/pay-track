import { inter } from "@/lib/fonts";
import "./globals.css";

export const metadata = {
  title: "PayTrack",
  description: "Track your expenses and income",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
