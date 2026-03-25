'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Company, User } from '@/lib/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from '../ui/card';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import InvestorForm from './investor-form';
import { createColumns } from './columns';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from '../ui/data-table-pagination';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Button } from '../ui/button';
import { Archive, Trash2, UserPlus, FilePenLine, UserCog } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';

const KYC_STATUS_OPTIONS = [
  { value: 'verified', label: 'Whitelisted' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
];

export default function InvestorList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Data state
  const [data, setData] = React.useState<User[]>([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | null>(null);

  // Drawer state
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingInvestor, setEditingInvestor] = React.useState<User | null>(null);

  // Dialog state
  const [dialogAction, setDialogAction] = React.useState<'archive' | 'delete' | null>(null);
  const [investorToDelete, setInvestorToDelete] = React.useState<User | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = React.useState('');

  // Search and filter state from URL
  const page = searchParams.get('page') ?? '1';
  const per_page = searchParams.get('per_page') ?? '10';
  const sort = searchParams.get('sort');
  const search = searchParams.get('q') ?? '';
  const kyc_statuses = searchParams.get('kycStatus');
  const statuses = searchParams.get('status');

  // Tanstack Table state
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const [column, order] = sort?.split('.') ?? [];
    return column ? [{ id: column, desc: order === 'desc' }] : [];
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const debouncedSearch = useDebounce(search, 300);

  // Fetch data when URL params change
  React.useEffect(() => {
    const companyId = localStorage.getItem('selectedCompanyId');
    setSelectedCompanyId(companyId);

    const handleCompanyChange = () => {
        const newCompanyId = localStorage.getItem('selectedCompanyId');
        setSelectedCompanyId(newCompanyId);
    };

    window.addEventListener('companyChanged', handleCompanyChange);

    return () => {
        window.removeEventListener('companyChanged', handleCompanyChange);
    };
  }, []);

  // Data fetching effect
  React.useEffect(() => {
    if (!selectedCompanyId) {
      setData([]);
      setPageCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const params = new URLSearchParams({
        page,
        perPage: per_page,
        companyId: selectedCompanyId,
    });
    if (debouncedSearch) params.append('query', debouncedSearch);
    if (sorting.length) {
      const sortItem = sorting[0];
      params.append('sort', `${sortItem.id}.${sortItem.desc ? 'desc' : 'asc'}`);
    }
    if (kyc_statuses) params.append('kycStatus', kyc_statuses);
    if (statuses) params.append('status', statuses);


    fetch(`/api/investors?${params.toString()}`)
      .then(res => res.json())
      .then(result => {
        setData(result.data || []);
        setPageCount(result.meta.totalPages || 0);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

  }, [page, per_page, debouncedSearch, sorting, kyc_statuses, statuses, selectedCompanyId]);
  
  // Update URL when filters/sorting change
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (sorting.length) {
        const sortItem = sorting[0];
        params.set('sort', `${sortItem.id}.${sortItem.desc ? 'desc' : 'asc'}`);
    } else {
        params.delete('sort');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [sorting, router, pathname, searchParams]);

  // Handlers
  const handleInvite = () => {
    setEditingInvestor(null);
    setIsSheetOpen(true);
  };

  const handleEdit = React.useCallback((investor: User) => {
    setEditingInvestor(investor);
    setIsSheetOpen(true);
  }, []);
  
  const handleArchive = React.useCallback(async (investor: User) => {
    const originalData = [...data];
    const isArchiving = !investor.isFrozen;

    // Optimistic UI update
    setData(prev => prev.map(inv => inv.id === investor.id ? { ...inv, isFrozen: isArchiving } : inv));
    
    try {
      const response = await fetch(`/api/investors/${investor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFrozen: isArchiving }),
      });

      if (!response.ok) throw new Error('Failed to update status.');
      
      const updatedInvestor = await response.json();
      // Confirm optimistic update
      setData(prev => prev.map(inv => (inv.id === investor.id ? updatedInvestor : inv)));

      toast({ title: `Investor ${isArchiving ? 'Archived' : 'Restored'}`, description: `"${investor.name}" has been updated.` });

    } catch (error) {
      // Rollback on error
      setData(originalData);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update status.' });
    }
  }, [data, toast]);
  
  const handleDelete = (investor: User) => {
    setInvestorToDelete(investor);
    setDialogAction('delete');
  };

  const confirmDelete = async () => {
    if (!investorToDelete || deleteConfirmationText !== investorToDelete.name) {
      toast({ variant: 'destructive', title: 'Confirmation failed', description: 'The name you entered does not match.' });
      return;
    }
    
    try {
        const response = await fetch(`/api/investors/${investorToDelete.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete investor.');
        
        setData(prev => prev.filter(inv => inv.id !== investorToDelete.id));
        toast({ title: 'Investor Deleted', description: `"${investorToDelete.name}" has been permanently deleted.` });
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    } finally {
        setDialogAction(null);
        setInvestorToDelete(null);
        setDeleteConfirmationText('');
    }
  };

  const table = useReactTable({
    data,
    columns: createColumns({ onEdit: handleEdit, onArchive: handleArchive, onDelete: handleDelete }),
    pageCount,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  
  const bulkActionToolbarVisible = Object.keys(rowSelection).length > 0;

  if (isMobile) {
    // Mobile Card View
    return (
       <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Investors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mobile card rendering would go here, mapping over `data` */}
        </div>
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="w-full space-y-4">
      <h1 className="text-3xl font-headline font-semibold">Investors</h1>

      {!selectedCompanyId ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <UserCog className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Company Selected</h2>
            <p className="text-muted-foreground mb-4">Please select a company from the sidebar to manage investors.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[150px]" />
          </div>
          <Card className="h-[400px]" />
        </div>
      ) : (
        <>
        <Card>
            <CardContent className="p-4 space-y-4">
              <DataTableToolbar table={table} onInvite={handleInvite} facetedFilters={[
                  { columnId: 'kycStatus', title: 'KYC Status', options: KYC_STATUS_OPTIONS },
                  { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
              ]} />
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="whitespace-nowrap">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className={index % 2 === 0 ? 'bg-muted/30' : ''}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={table.getAllColumns().length}
                          className="h-96 text-center"
                        >
                           <div className="flex flex-col items-center justify-center h-full">
                            <FilePenLine className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">No investors found</h3>
                            <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </CardContent>
          </Card>

          {/* Bulk Action Toolbar */}
          {bulkActionToolbarVisible && (
            <div className="fixed bottom-4 right-4 z-50">
              <Card className="p-2 shadow-lg">
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium px-2">
                    {table.getFilteredSelectedRowModel().rows.length} selected
                  </p>
                  <Button variant="outline" size="sm">
                    <Archive className="mr-2 h-4 w-4" /> Archive
                  </Button>
                   <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Drawer for Create/Edit */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
              <InvestorForm investor={editingInvestor} onFinished={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* High-friction Delete Dialog */}
          <AlertDialog open={dialogAction === 'delete'} onOpenChange={() => { setDialogAction(null); setInvestorToDelete(null); setDeleteConfirmationText(''); }}>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action is irreversible and will permanently delete the investor <span className="font-bold">{investorToDelete?.name}</span>.
                          To confirm, please type the investor's full name below.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input 
                      value={deleteConfirmationText}
                      onChange={(e) => setDeleteConfirmationText(e.target.value)}
                      placeholder={investorToDelete?.name}
                  />
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={confirmDelete}
                          disabled={deleteConfirmationText !== investorToDelete?.name}
                          className="bg-destructive hover:bg-destructive/90"
                      >
                          Delete Investor
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
