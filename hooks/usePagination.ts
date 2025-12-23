import { useState } from "react";

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
  };
};
