"use client";

import Providers from "./providers";
import { Toaster } from "sonner";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Providers>
      {children}
      <Toaster richColors position="top-center" />{" "}
      {/* Now it's inside the provider tree */}
    </Providers>
  );
}
