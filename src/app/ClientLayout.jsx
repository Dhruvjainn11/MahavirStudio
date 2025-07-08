"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/cartContext";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./context/authContext";
import AuthModal from "./components/AuthModal";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
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
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
