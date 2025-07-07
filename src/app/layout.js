import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Mahavir Studio - Premium Interior Hardware & Paint Solutions",
  description: "Transform your space with premium hardware, curated paints, and designer bundles. Quality interior solutions since 2008.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
