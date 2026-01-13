"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function PageContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 10000); // 👈 minimum display time

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
