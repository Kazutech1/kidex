import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Kidex Reader - Futuristic Manga Platform",
  description: "Experience premium manga reading with Apple-style fluid layout designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#09090b]">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}


