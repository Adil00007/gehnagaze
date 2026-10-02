import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Gehna Gaze | Fine Jewelry",
  description:
    "Gehna Gaze — handpicked jewelry pieces, shopped straight from our Instagram edit. Bank transfer and JazzCash accepted.",
};

export default async function RootLayout({ children }) {
  const branding = await getSiteContent();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <CartProvider>
          <AnnouncementBar />
          <Navbar branding={branding} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer branding={branding} />
        </CartProvider>
      </body>
    </html>
  );
}
