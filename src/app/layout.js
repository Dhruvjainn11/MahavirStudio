import "./globals.css";
import { AuthProvider } from "./context/authContext";
import { AdminProvider } from "./context/adminContext";
import { CartProvider } from "./context/cartContext";
import ConditionalLayout from "./ConditionalLayout";
import QueryProvider from "@/provider/QueryProvider";
import { ToastProvider } from '@/app/components/Toast';
import { WishlistProvider } from "./context/wishlistContext";
export const metadata = {
  title: "Mahavir Studio - Premium Interior Hardware & Paint Solutions",
  description: "Transform your space with premium hardware, curated paints, and designer bundles. Quality interior solutions since 2008.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <AuthProvider>
          <AdminProvider>
            <ToastProvider>
              <WishlistProvider>
                <CartProvider>
                  <QueryProvider>
                    <ConditionalLayout>{children}</ConditionalLayout>
                  </QueryProvider>
                </CartProvider>
              </WishlistProvider>
            </ToastProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
