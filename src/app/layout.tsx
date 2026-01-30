import type { Metadata } from "next";
import "./globals.css";
import SWRProvider from "@/components/providers/SWRProvider";

export const metadata: Metadata = {
  title: "KL Bus Tracker",
  description: "Live Prasarana bus positions in Kuala Lumpur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
