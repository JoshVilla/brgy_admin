import { useState } from "react";

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to page 1 when changing limit
  };

  return {
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
    setCurrentPage,
    limit,
    handleLimitChange,
  };
};
