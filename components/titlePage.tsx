"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  title: string;
  hasBack?: boolean;
}

const TitlePage = ({ title, hasBack }: Props) => {
  const router = useRouter();
  const returnPrevPage = () => router.back();
  return (
    <div className="flex items-center gap-2">
      {hasBack && (
        <ArrowLeft className="cursor-pointer" onClick={returnPrevPage} />
      )}
      <span className="text-2xl font-semibold">{title}</span>
    </div>
  );
};

export default TitlePage;
