"use client";

import { useCart } from "../context/cartContext"; // Ensure this path is correct
import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + parseInt(item.price.replace("₹", "").replace(",", "")),
    0
  );

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-serif text-charcoal-800 mb-10 text-center">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-charcoal-500">
          <p>Your cart is empty 🛒</p>
          <Link
            href="/products"
            className="inline-block mt-4 text-gold-600 underline"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-6 border border-beige-200 p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="w-full sm:w-32 h-32 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-charcoal-800">
                    {item.name}
                  </h3>
                  <p className="text-charcoal-500 text-sm mb-2">
                    {item.finish} Finish
                  </p>
                  <p className="text-gold-600 font-medium">{item.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.slug)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-lg font-semibold text-charcoal-800">
              Total: <span className="text-gold-600">₹{totalPrice.toLocaleString()}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2 border border-charcoal-800 text-charcoal-800 hover:bg-charcoal-800 hover:text-white rounded-md transition"
              >
                Clear Cart
              </button>
              <button className="px-4 py-2 bg-gold-500 text-white hover:bg-gold-600 rounded-md transition">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
