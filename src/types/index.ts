import { ReactNode } from "react";

// ── DataTable ──────────────────────────────────────────────────────────────

export interface TableColumn<T> {
    key: keyof T | "index" | "actions" | string;
    label: string;
    width?: string;
    align?: "left" | "center" | "right";
    render?: (item: T) => ReactNode;
    headerClassName?: string;
}

export interface PaginationOptions {
    count?: number;
    current_page?: number;
    num_pages?: number;
}

export interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    isPaginate?: boolean;
    paginationOptions?: PaginationOptions;
    pageSize?: number;
    setPageSize?: (size: number) => void;
    isError?: boolean;
    errorMessage?: string;
    onPageChange?: (page: number) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

export interface TablePaginationProps {
    paginationOptions: PaginationOptions;
    pageSize?: number;
    setPageSize?: (size: number) => void;
    onPageChange?: (page: number) => void;
}

// ── TableActionsDropdown ───────────────────────────────────────────────────

export interface TableActionsDropdownProps {
    isView?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    viewUrl?: string;
    editUrl?: string;
    isDeleting?: boolean;
    moduleName?: string;
    openModal?: boolean;
    setOpenModal?: (open: boolean) => void;
    deleteFunc?: () => void;
    isClassTable?: boolean;
    classCloneFunc?: () => void;
    isClassCloning?: boolean;
}
