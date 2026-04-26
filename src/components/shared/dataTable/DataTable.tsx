"use client";

import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import TableRow from "./TableRow";

import { Table, TableBody, TableFooter } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableProps } from "@/types";
import { constantsData } from "@/constants";

const DataTable = <T,>({
  data,
  columns,
  isPaginate = true,
  paginationOptions,
  pageSize,
  setPageSize,
  isError = false,
  errorMessage = "An error occurred while loading data",
  onPageChange,
  isLoading = false,
  emptyMessage = "No data available",
}: DataTableProps<T>) => {
  return (
    <section className="w-full rounded-xl overflow-hidden border ">
      <Table>
        <TableHeader columns={columns} />
        <TableBody>
          {isLoading ? (
            Array.from({ length: constantsData.TABLE_SKELETON_ROWS }).map((_, rowIdx) => (
              <tr key={`skeleton-${rowIdx}`} className="border-b last:border-0">
                {Array.from({ length: columns?.length ?? 1 }).map((_, colIdx) => (
                  <td key={`skeleton-cell-${colIdx}`} className="px-4 py-4">
                    {colIdx === 1 ? (
                      /* Image + Name cell */
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-28 rounded" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Skeleton className="h-3.5 w-full max-w-[120px] rounded" />
                        <Skeleton className="h-3 w-2/3 max-w-[80px] rounded opacity-60" />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : isError ? (
            <tr>
              <td colSpan={columns?.length} className="text-center py-12">
                <div className="text-destructive text-sm">
                  <div className="mb-2">⚠️</div>
                  {errorMessage}
                </div>
              </td>
            </tr>
          ) : !data || data.length === 0 ? (
            <tr>
              <td colSpan={columns?.length} className="text-center py-12">
                <div className="text-muted-foreground text-sm">
                  <div className="mb-2">📄</div>
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data?.map((item, index) => (
              <TableRow
                key={`row-${index}`}
                item={item}
                columns={columns}
                rowIndex={((paginationOptions?.current_page ?? 1) - 1) * (pageSize ?? 10) + index}
              />
            ))
          )}
        </TableBody>

        {isPaginate && paginationOptions && (
          <TableFooter>
            <tr>
              <td colSpan={columns.length} className="p-0">
                <TablePagination
                  paginationOptions={paginationOptions}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  onPageChange={onPageChange}
                />
              </td>
            </tr>
          </TableFooter>
        )}
      </Table>
    </section>
  );
};

export default DataTable;
