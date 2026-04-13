export interface AdminUsersTableProps {
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    approvalStatus?: string;
    search?: string;
    bloodGroup?: string;
    section?: string;
    dobYear?: number;
    dobMonth?: number;
    dobDay?: number;
    isVerified?: boolean;
    emptyMessage?: string;
}