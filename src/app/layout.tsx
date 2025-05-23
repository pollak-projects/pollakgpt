import type { Metadata } from "next";
import "./globals.css";
import "./prism-theme.css";

export const metadata: Metadata = {
  title: "PollakGPT",
  description: "PollakGPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
