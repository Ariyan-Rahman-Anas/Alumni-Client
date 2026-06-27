"use client";

import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    total?: number;
    pageSize?: number;
    dataCount?: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, total, pageSize, dataCount, onPageChange }: PaginationProps) => {
    const [current, setCurrent] = useState(page);

    useEffect(() => {
        setCurrent(page);
    }, [page]);

    const canPrev = current > 1;
    const canNext = current < totalPages;

    const getVisiblePages = () => {
        const pagesToShow = 3;
        let start = Math.max(1, current - Math.floor(pagesToShow / 2));
        let end = start + pagesToShow - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - pagesToShow + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();
    const showFirst = visiblePages[0] > 1;
    const showLast = visiblePages[visiblePages.length - 1] < totalPages;

    const handleChange = (p: number) => {
        if (p !== current) {
            setCurrent(p);
            onPageChange(p);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between flex-wrap gap-3 px-1 py-3">
            {total !== undefined && pageSize !== undefined && dataCount !== undefined ? (
                <p className="text-sm text-muted-foreground">
                    Showing {(current - 1) * pageSize + 1}–{(current - 1) * pageSize + dataCount} of {total} results
                </p>
            ) : total !== undefined ? (
                <p className="text-sm text-muted-foreground">Total: {total}</p>
            ) : (
                <p className="text-sm text-muted-foreground">Page {current} of {totalPages}</p>
            )}

            <div className="flex items-center gap-1">
                <button onClick={() => handleChange(1)} disabled={!canPrev} className="pagination-btn">
                    <ChevronsLeft className="h-4 w-4" />
                </button>
                <button onClick={() => handleChange(Math.max(current - 1, 1))} disabled={!canPrev} className="pagination-btn">
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                    {showFirst && (
                        <>
                            <button onClick={() => handleChange(1)} className="pagination-btn">1</button>
                            {visiblePages[0] > 2 && <span className="px-1.5 text-sm text-muted-foreground">…</span>}
                        </>
                    )}

                    {visiblePages.map((p) => (
                        <button
                            key={p}
                            onClick={() => handleChange(p)}
                            className={
                                current === p
                                    ? "h-8 w-9 rounded-md flex items-center justify-center border border-primary bg-primary shadow-xs hover:bg-primary/90 text-primary-foreground cursor-pointer text-sm"
                                    : "pagination-btn"
                            }
                        >
                            {p}
                        </button>
                    ))}

                    {showLast && (
                        <>
                            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                                <span className="px-1.5 text-sm text-muted-foreground">…</span>
                            )}
                            <button onClick={() => handleChange(totalPages)} className="pagination-btn">{totalPages}</button>
                        </>
                    )}
                </div>

                <button onClick={() => handleChange(Math.min(current + 1, totalPages))} disabled={!canNext} className="pagination-btn">
                    <ChevronRight className="h-4 w-4" />
                </button>
                <button onClick={() => handleChange(totalPages)} disabled={!canNext} className="pagination-btn">
                    <ChevronsRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
export default Pagination;