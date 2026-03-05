'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '../ui/data-table-view-options';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Option } from '@/lib/types';


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onInvite: () => void;
  facetedFilters?: {
      columnId: string;
      title: string;
      options: Option[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  onInvite,
  facetedFilters = [],
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('q') ?? '';

  const isFiltered = Array.from(searchParams.values()).some(value => value.length > 0 && value !== '1' && value !== '10' && !value.includes('.'));

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  
  const handleResetFilters = () => {
    router.replace(pathname);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by name, email, or wallet..."
          value={search}
          onChange={(event) => {
            router.replace(`${pathname}?${createQueryString('q', event.target.value)}`);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {facetedFilters.map(({ columnId, title, options }) => (
            table.getColumn(columnId) && (
                 <DataTableFacetedFilter
                    key={columnId}
                    column={table.getColumn(columnId)}
                    title={title}
                    options={options}
                />
            )
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button onClick={onInvite} size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            Invite Investor
        </Button>
      </div>
    </div>
  );
}
