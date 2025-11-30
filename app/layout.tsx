import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "주부(주식으로 부자되기)",
  description: "주식 투자 도우미",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
