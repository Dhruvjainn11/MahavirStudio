import { Suspense } from "react";
import ProductDetailPage from "./ProductDetailPage";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading Products...</div>}>
      <ProductDetailPage />
    </Suspense>
  );
}
