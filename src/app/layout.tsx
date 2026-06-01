import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Formator AI - Generateur de formations IA",
  description:
    "Generez en quelques minutes une formation IA complete, personnalisee et professionnelle pour n'importe quelle entreprise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:pl-64">
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
