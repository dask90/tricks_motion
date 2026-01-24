import type { Metadata } from "next";
import "@/styles/index.css";
import { Navigation } from "@/app/components/Navigation";
import { Footer } from "@/app/components/Footer";

export const metadata: Metadata = {
    title: "Tricks Motion",
    description: "Portfolio and motion design services",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background text-foreground antialiased">
                <Navigation />
                {children}
                <Footer />
            </body>
        </html>
    );
}
