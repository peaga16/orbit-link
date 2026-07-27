import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./global.css";

export const metadata: Metadata = {
  title: "LinkFlow - SaaS de Link in Bio",
  description: "Plataforma para criar páginas personalizadas com links",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}