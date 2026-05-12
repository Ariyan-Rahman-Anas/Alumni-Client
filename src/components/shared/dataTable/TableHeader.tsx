"use client";

import {
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableColumn } from "@/types";

interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
}

const TableHeader = <T,>({ columns }: TableHeaderProps<T>) => {
  return (
    <ShadcnTableHeader>
      <TableRow className="border-b border-gray-200 dark:border-gray-500">
        {columns.map((column, idx) => (
          <TableHead
            key={idx}
            className={`px-1 py-4 text-sm font-semibold text-gunmetal-700 dark:text-gunmetal-200 ${
              column.align === "left" ? "text-left" : column.align === "right" ? "text-right" : "text-center"
            } ${column.headerClassName || ""}`}
            style={{
              width: column.width || "auto",
              minWidth: column.width || "auto",
            }}
          >
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </ShadcnTableHeader>
  );
};

export default TableHeader;
