import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavigationGuard from "../components/NavigationGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlenoPsi - Gestão Clinica",
  description:
    "Plataforma completa para profissionais de saúde: agendamento, financeiro e gestão de consultório.",
  keywords: ["psicologia", "gestão", "consultório", "agendamento", "PlenoPsi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationGuard />
        {children}
      </body>
    </html>
  );
}
