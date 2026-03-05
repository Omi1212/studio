'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/lib/types';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface ColumnsProps {
    onEdit: (investor: User) => void;
    onArchive: (investor: User) => void;
    onDelete: (investor: User) => void;
}

function getStatusBadge(investor: User) {
  if (investor.isFrozen) {
    return <Badge variant="secondary" className="bg-sky-600/20 text-sky-400 border-sky-400/50">Archived</Badge>;
  }
  return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
}

function getKycBadge(kycStatus: User['kycStatus']) {
    switch (kycStatus) {
        case 'verified':
            return <Badge variant="outline" className="text-green-400 border-green-400">Whitelisted</Badge>;
        case 'pending':
            return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
        case 'rejected':
            return <Badge variant="destructive">Rejected</Badge>;
        default:
            return <Badge variant="secondary">Unknown</Badge>;
    }
}


export const createColumns = ({ onEdit, onArchive, onDelete }: ColumnsProps): ColumnDef<User>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Investor" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link href={`/investors/${user.id}`} className="flex items-center gap-3 group">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium group-hover:underline">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'totalInvested',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Invested" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">${(row.original.totalInvested || 0).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: 'walletAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{row.original.walletAddress.slice(0, 7)}...{row.original.walletAddress.slice(-4)}</span>
    ),
  },
  {
    accessorKey: 'kycStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="KYC Status" />
    ),
    cell: ({ row }) => getKycBadge(row.original.kycStatus),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.original),
    filterFn: (row, id, value) => {
      const isArchived = row.original.isFrozen;
      if (value.includes('archived')) return isArchived;
      if (value.includes('active')) return !isArchived;
      return true;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} />,
  },
];
