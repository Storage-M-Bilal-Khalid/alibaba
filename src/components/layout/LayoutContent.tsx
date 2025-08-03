"use client";

import { usePathname } from "next/navigation";
import Navbar from "../shared/Navbar/Navbar";
import MaxWidthWrapper from "../shared/MaxWidthWrapper";
import Footer from "../shared/Footer";
import { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideMaxWidthWrapper = useMemo(() => pathname.startsWith("/dashboard"), [pathname]);
  const hideUI = useMemo(() => pathname.startsWith("/auth") || pathname.startsWith("/dashboard"), [pathname]);

  return (
  <>
    {!hideUI && <Navbar />}
    {!hideMaxWidthWrapper ? (
      <MaxWidthWrapper className="mb-5">
        {children}
      </MaxWidthWrapper>
    ) : (
      children
    )}
    {!hideUI && <Footer />}
  </>
);
 
}
