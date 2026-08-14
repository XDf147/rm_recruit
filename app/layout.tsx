import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RM Recruit｜RoboMaster 战队招新", template: "%s｜RM Recruit" },
  description: "RoboMaster 战队简历投递与分组审核系统。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
