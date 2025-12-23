"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="my-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className={`${
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            } cursor-pointer`}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              size="sm"
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
              className={`${
                page === currentPage ? "bg-primary text-white" : ""
              } cursor-pointer`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className={`${
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            } cursor-pointer`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
