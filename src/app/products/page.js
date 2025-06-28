import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Products...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
