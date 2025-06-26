import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  return (
      <html lang="en">
         <body  className="bg-white text-gray-800">
          <Navbar />
           <main className=" h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth ">
          
            {children}
              
            <section className="snap-start">
              <Footer />
            </section>
            </main>
        </body>
      </html>
    );
}
