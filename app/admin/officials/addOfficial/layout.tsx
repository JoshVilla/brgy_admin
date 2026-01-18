import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Add Official",
  icons: {
    icon: "/logo/laurel_logo.ico",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
