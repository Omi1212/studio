'use client'

import { MoreHorizontal } from "lucide-react"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/lib/types"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>,
  onEdit: (data: TData) => void;
  onArchive: (data: TData) => void;
  onDelete: (data: TData) => void;
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onArchive,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const investor = row.original as User;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onEdit(row.original)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onArchive(row.original)}>
          {investor.isFrozen ? 'Restore' : 'Archive'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={() => onDelete(row.original)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
