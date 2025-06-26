"use client";
import Image from "next/image";

const brands = [
  { name: "Jaquar", logo: "/brands/jaquar.png" },
  { name: "Cera", logo: "/brands/cera.png" },
  { name: "Asian Paints", logo: "/brands/asianpaints.png" },
  // You can add more here
];

export default function TrustedBrands() {
  return (
    <section className="py-20 bg-beige-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal-800 mb-12">
          Trusted by Leading Brands
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={60}
                className="object-contain mix-blend-multiply  transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
