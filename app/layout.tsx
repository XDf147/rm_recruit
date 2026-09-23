import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Polar Bear 战队",
  title: {
    default: "Polar Bear 战队｜以我之眼，探索无限｜Команда Polar Bear · Моими глазами — к бесконечности",
    template: "%s｜Polar Bear 战队",
  },
  description: "Polar Bear 机器人战队——以我之眼，探索无限。Моими глазами — к бесконечности.",
  icons: {
    icon: [{ url: "/images/brand/polarbear.png", type: "image/png" }],
    shortcut: "/images/brand/polarbear.png",
    apple: "/images/brand/polarbear.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
