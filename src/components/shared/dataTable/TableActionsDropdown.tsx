import { Copy, Edit, EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";


import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableActionsDropdownProps } from "@/types";

const TableActionsDropdown = ({
  isView = true,
  isEdit = true,
  isDelete = true,
  viewUrl,
  editUrl,
  // isDeleting,
  // moduleName,
  // openModal,
  // setOpenModal,
  // deleteFunc,
  isClassTable = false,
  classCloneFunc,
  isClassCloning,
}: TableActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isView && (
            <DropdownMenuItem className="p-0 group">
              <Link href={viewUrl as string} className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full p-0 hover:text-primary hover:bg-primary/10 flex items-center justify-start gap-2 cursor-pointer"
                  title="View"
                >
                  <Eye className="group-hover:text-primary" />
                  View
                </Button>
              </Link>
            </DropdownMenuItem>
          )}
          {isEdit && (
            <DropdownMenuItem className="p-0 group">
              <Link href={editUrl as string} className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full p-0 hover:text-primary hover:bg-primary/10 flex items-center justify-start gap-2 cursor-pointer"
                  title="Edit"
                >
                  <Edit className="group-hover:text-primary" />
                  Edit
                </Button>
              </Link>
            </DropdownMenuItem>
          )}
          {isDelete && (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0 group"
            >
              {/* <DeleteModal
                subtitle={`Are you sure you want to remove this ${moduleName ?? "data"}`}
                isLoading={isDeleting}
                onConfirmFunc={deleteFunc}
                openModal={openModal}
                setOpenModal={setOpenModal}
              /> */}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        {isClassTable && <DropdownMenuSeparator />}
        <DropdownMenuGroup>
          {isClassTable && (
            <DropdownMenuItem className="p-0 group">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full p-0 hover:text-primary hover:bg-primary/10 flex items-center justify-start gap-2 cursor-pointer"
                onClick={classCloneFunc}
                title="Clone"
              >
                <Copy className="group-hover:text-primary" />
                {isClassCloning ? "Cloning..." : "Clone this class"}
              </Button>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default TableActionsDropdown;
