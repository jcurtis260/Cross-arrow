import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cross-Arrow - Sliding Line Puzzle Game",
  description: "A minimalist sliding line puzzle game. Clear the board by pushing lines off the grid. Think strategically and enjoy the calm flow!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
