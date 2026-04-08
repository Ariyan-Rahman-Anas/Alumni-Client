"use client";

import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import TableRow from "./TableRow";

import { Table, TableBody, TableFooter } from "@/components/ui/table";
import { DataTableProps } from "@/types";

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
            <tr>
              <td colSpan={columns?.length} className="text-center py-12">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-muted-foreground"></div>
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              </td>
            </tr>
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
                rowIndex={index}
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
