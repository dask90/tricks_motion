import type { Metadata, Viewport } from "next";
import "@/styles/index.css";
import { Navigation } from "@/app/components/Navigation";
import { Footer } from "@/app/components/Footer";
import { ThemeProvider } from "@/app/providers";

export const metadata: Metadata = {
    title: "Tricks Motion",
    description: "Portfolio and motion design services",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background text-foreground antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navigation />
                    {children}
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
