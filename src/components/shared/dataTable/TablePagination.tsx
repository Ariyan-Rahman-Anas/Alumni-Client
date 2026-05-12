"use client";

import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { TablePaginationProps } from "@/types";

const TablePagination = ({
  paginationOptions,
  pageSize,
  onPageChange,
}: TablePaginationProps) => {
  const { count = 0, current_page = 1 } = paginationOptions;

  const [currentPage, setCurrentPage] = useState(current_page);
  const totalPages = paginationOptions?.num_pages ?? 1;

  // Sync with server-driven current_page (e.g. after tab switch or external filter)
  useEffect(() => {
    setCurrentPage(current_page);
  }, [current_page]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Calculate the range of page numbers to display
  const getVisiblePageNumbers = () => {
    const pagesToShow = 3;
    let start = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let end = start + pagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - pagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const visiblePageNumbers = getVisiblePageNumbers();
  const showFirstPage = visiblePageNumbers[0] > 1;
  const showLastPage =
    visiblePageNumbers[visiblePageNumbers?.length - 1] < totalPages;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      onPageChange?.(pageNumber);
    }
  };

  return (
    <div
      // className="flex items-center justify-between px-6 py-3 border-t border-gray-200"
      className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-500 flex-wrap gap-2 min-w-0"
    >
      <div className="text-sm text-gunmetal-700 dark:text-gunmetal-300">
        Showing {(current_page - 1) * (pageSize || 10) + 1} to{" "}
        {Math.min(current_page * (pageSize || 10), count)} of {count} results
      </div>

      <div className="flex items-center space-x-1">
        {/* First page button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={!canGoPrevious}
          className="pagination-btn"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={!canGoPrevious}
          className="pagination-btn"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {/* Show first page and ellipsis if needed */}
          {showFirstPage && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="pagination-btn"
              >
                1
              </button>
              {visiblePageNumbers[0] > 2 && (
                <span className="px-2 text-sm text-gray-500">...</span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              // className="pagination-btn">
              className={
                currentPage === number
                  ? "h-8 w-9 rounded-md flex items-center justify-center border border-primary  hover:border-primary/80 bg-primary shadow-xs hover:bg-primary/90 text-primary-foreground cursor-pointer "
                  : "pagination-btn"
              }
            >
              {number}
            </button>
          ))}

          {/* Show ellipsis and last page if needed */}
          {showLastPage && (
            <>
              {visiblePageNumbers[visiblePageNumbers?.length - 1] <
                totalPages - 1 && (
                <span className="px-2 text-sm text-gray-500">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="pagination-btn"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next page button */}
        <button
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={!canGoNext}
          className="pagination-btn"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={!canGoNext}
          className="pagination-btn"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
export default TablePagination;
