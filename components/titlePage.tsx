"use client";
import { ArrowLeft, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  title: string;
  hasBack?: boolean;
  description?: string;
}

const TitlePage = ({ title, hasBack, description }: Props) => {
  const router = useRouter();
  const returnPrevPage = () => router.back();
  return (
    <div>
      <div className="flex items-center gap-2">
        {hasBack && (
          <ArrowLeft className="cursor-pointer" onClick={returnPrevPage} />
        )}
        <span className="text-2xl font-semibold">{title}</span>
      </div>
      {description && (
        <div className="text-gray-500 flex align-middle gap-2">
          <InfoIcon className="w-4" />
          {description}
        </div>
      )}
    </div>
  );
};

export default TitlePage;
