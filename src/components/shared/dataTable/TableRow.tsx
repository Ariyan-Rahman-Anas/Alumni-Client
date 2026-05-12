"use client";

import { TableCell, TableRow as ShadcnTableRow } from "@/components/ui/table";
import { TableColumn } from "@/types";

interface TableRowProps<T> {
  item: T;
  columns: TableColumn<T>[];
  rowIndex: number;
}

const TableRow = <T,>({ item, columns, rowIndex }: TableRowProps<T>) => {
  return (
    <ShadcnTableRow className="border-b border-gray-100 dark:border-gray-600 hover:bg-gunmetal-50 dark:hover:bg-gunmetal-900 text-gunmetal-500 dark:text-gunmetal-300 transition-colors">
      {columns.map((column, columnIndex) => (
        <TableCell
          key={columnIndex}
          className={`p-3 md:p-4 ${
            column.align === "left" ? "text-left" : column.align === "right" ? "text-right" : "text-center"
          } ${column || ""}`}
          style={{
            width: column.width || "auto",
            minWidth: column.width || "auto",
          }}
        >
          <div className="overflow-hidden">
            {column.key === "index" ? (
              <span className="text-sm font-medium">
                {rowIndex + 1}
              </span>
            ) : column.render ? (
              <span>
                {column.render(item)}
              </span>
            ) : (
              <span className="block truncate">
                {String(item[column.key as keyof T] ?? "")}
              </span>
            )}
          </div>
        </TableCell>
      ))}
    </ShadcnTableRow>
  );
};
export default TableRow;
