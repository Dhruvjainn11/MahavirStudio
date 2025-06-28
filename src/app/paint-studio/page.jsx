import { Suspense } from "react";
import PaintStudioClient from "./PaintStudioClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Paint Studio...</div>}>
      <PaintStudioClient />
    </Suspense>
  );
}
