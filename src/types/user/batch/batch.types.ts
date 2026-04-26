export interface IBatchUsersTableProps {
    page?: number;
    limit: number;
    onPageChange?: (page: number) => void;
    search?: string;
    bloodGroup?: string;
    section?: string;
    batch?: string;
    emptyMessage?: string;
}


export interface IBatchUserFilterValues {
    search?: string | undefined;
    bloodGroup?: string | undefined;
    batch?: string | undefined;
    section?: string | undefined;
}