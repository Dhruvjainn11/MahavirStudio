"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/cartContext";
import { ToastProvider } from "./components/Toast";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  return (
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
  );
}
