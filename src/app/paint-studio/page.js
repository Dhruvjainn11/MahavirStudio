"use client";
import { useSearchParams } from "next/navigation";

export default function PaintStudioPage() {
  const params = useSearchParams();
  const mode = params.get("mode");

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-serif text-charcoal-800 mb-6">
        {mode === "exterior" ? "Exterior Paint Studio" : "Interior Paint Studio"}
      </h1>
      <p className="text-charcoal-600 mb-4">
        (3D tool coming soon... choose palettes, preview colors, and visualize rooms.)
      </p>

      {/* Later: render interactive tool or iframe here */}
      <div className="w-full h-[400px] bg-beige-200 border border-beige-300 rounded-md flex items-center justify-center text-charcoal-600">
        3D Studio Preview Area
      </div>
    </section>
  );
}
