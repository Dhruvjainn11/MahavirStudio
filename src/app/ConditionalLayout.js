"use client";

import { usePathname } from "next/navigation";
import ClientLayout from "./ClientLayout";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return isAdminRoute ? children : <ClientLayout>{children}</ClientLayout>;
}
