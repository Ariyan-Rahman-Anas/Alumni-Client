"use client";

import DataTable from "@/components/shared/dataTable/DataTable";
import {
    useGetInterestedBloodDonorsQuery,
} from "@/redux/apis/userApi";
import Image from "next/image";
import { TableColumn } from "@/types";
import { IBatchUsersTableProps } from "@/types/user/batch/batch.types";
import { IUserProfile } from "../profile/user-profile.types";
import DateFormatter from "@/lib/DateFormatter";

const BloodBankPageDonorsTable = ({
    page,
    limit,
    onPageChange,
    search,
    bloodGroup,
    batch,
    section,
    emptyMessage = "No users found",
}: IBatchUsersTableProps) => {

    const { data: allApprovedUsersData, isLoading: isAllApprovedUsersLoading, isError } = useGetInterestedBloodDonorsQuery({ page, limit, search, bloodGroup, batch, section });

    const columns: TableColumn<IUserProfile>[] = [
        {
            key: "index", label: "SN."
        },
        {
            key: "imageUrl", label: "Image & Name",
            width: "0%",
            render: (u) => (
                <div className="flex items-center w-fit gap-3">
                    <div className="h-20 w-20 rounded-full border-2 border-surface-200 flex items-center justify-center overflow-hidden">
                        {u.imageUrl ? <Image src={u.imageUrl ?? ""} alt={u.name.slice(0, 5)} width={500} height={500} /> : <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">{u.name.slice(0, 2).toUpperCase()}</div>}
                    </div>
                    <p>{u.name}</p>
                </div>
            )
        },
        {
            key: "batch",
            label: "Batch",
            render: (u) => (
                <div>
                    <p>{u.batch}</p>
                    <p className="capitalize" >{u.section?.toLowerCase() ?? "N/A"}</p>

                </div>
            )
        },
        {
            key: "contact",
            label: "Contact",
            render: (u) => (
                <div>
                    <p>{u.phone}</p>
                    <p>{u.email}</p>

                </div>
            )
        },
        {
            key: "bloodGroup", label: "Blood group",
        },
        {
            key: "bloodDonateCount",
            label: "Previously donated",
            render: (u) => <p>{u.bloodDonateCount} times</p>
        },
        {
            key: "lastBloodDonationDate",
            label: "Last donation at",
            render: (u) => <DateFormatter date={u.lastBloodDonationDate} />
        },
        {
            key: "currentAddress", label: "Current address",
            render: (u) => (
                <div className="w-fit mx-auto max-w-[15rem] h-fit max-h-[6rem] overflow-auto ">
                    {(u.currentAddress ?? "N/A").split(",").map((part, index) => (<p key={index}>{part.trim()}{index < (u.currentAddress ?? "").split(",").length - 1 && ","} </p>
                    ))}
                </div>
            )
        },

    ];

    const meta = allApprovedUsersData?.meta;
    const paginationOptions = meta
        ? { count: meta.total, current_page: meta.page, num_pages: meta.totalPage }
        : undefined;

    return (
        <>
            <DataTable<IUserProfile>
                data={allApprovedUsersData?.data ?? []}
                columns={columns}
                isLoading={isAllApprovedUsersLoading}
                isError={isError}
                errorMessage="Failed to load users"
                emptyMessage={emptyMessage}
                isPaginate={!!paginationOptions}
                paginationOptions={paginationOptions}
                pageSize={limit}
                onPageChange={onPageChange}
            />
        </>
    );
};
export default BloodBankPageDonorsTable;