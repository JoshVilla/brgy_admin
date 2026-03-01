"use client";

import Providers from "./providers";
import { Toaster } from "sonner";
import { Toaster as SileoToaster } from "sileo";
type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Providers>
      {children}
      <SileoToaster position="top-right" theme="dark" offset={10} />
      <Toaster richColors position="top-center" />
      {/* Now it's inside the provider tree */}
    </Providers>
  );
}
