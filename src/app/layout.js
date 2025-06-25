import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Mahavir Studio",
  description: "Premium Paints and Hardware Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <Navbar />
        <main className="">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
