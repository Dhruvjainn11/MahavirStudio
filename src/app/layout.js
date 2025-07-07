"use client";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/cartContext";
import { ToastProvider } from "./components/Toast";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main
              className={`overflow-y-auto scroll-smooth ${
                isHome ? "snap-y snap-mandatory h-screen" : "min-h-screen"
              }`}
            >
              {children}

              <section className={isHome ? "snap-start" : ""}>
                <Footer />
              </section>
            </main>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
