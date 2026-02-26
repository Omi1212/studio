'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ViewMode, User, Company } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, LayoutGrid, List, UserPlus, Snowflake, Search, Plus, KeyRound, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import KybBanner from '@/components/dashboard/kyb-banner';
import IdentityProvidersBanner from '@/components/dashboard/identity-providers-banner';


type Investor = User;
const ITEMS_PER_PAGE = 10;

function getStatusBadge(investor: Investor) {
  if (investor.isFrozen) {
    return <Badge variant="secondary" className="bg-sky-600/20 text-sky-400 border-sky-400/50">Frozen</Badge>;
  }
  
  switch (investor.kycStatus) {
    case 'verified':
      return <Badge variant="outline" className="text-green-400 border-green-400">Whitelisted</Badge>;
    default:
        // In this list, we only show verified investors, so other statuses are less likely.
        // But as a fallback:
      return <Badge variant="secondary">{investor.kycStatus}</Badge>;
  }
}

function InvestorCard({ investor, onFreezeClick, onResetPassword, onDeleteClick }: { investor: Investor, onFreezeClick: () => void, onResetPassword: () => void, onDeleteClick: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{investor.name}</CardTitle>
              <CardDescription>{investor.email}</CardDescription>
            </div>
          </div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onResetPassword}>
                    Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFreezeClick}>
                  {investor.isFrozen ? 'Unfreeze' : 'Freeze'} Address
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={onDeleteClick}>
                  Cancel Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Status</span>
          {getStatusBadge(investor)}
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Invested</span>
          <span className="font-medium font-mono">${(investor.totalInvested || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Wallet</span>
            <span className="font-medium font-mono truncate">{investor.walletAddress.slice(0, 7)}...{investor.walletAddress.slice(-4)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
           <Link href={`/investors/${investor.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function InvestorTableRow({ investor, onFreezeClick, onResetPassword, onDeleteClick }: { investor: Investor, onFreezeClick: () => void, onResetPassword: () => void, onDeleteClick: () => void }) {
  const router = useRouter();

  return (
    <TableRow 
      onClick={() => router.push(`/investors/${investor.id}`)}
      className="cursor-pointer"
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{investor.name}</p>
            <p className="text-sm text-muted-foreground">{investor.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="font-mono">${(investor.totalInvested || 0).toLocaleString()}</span>
      </TableCell>
       <TableCell className="hidden lg:table-cell">
        <span className="font-mono">{investor.walletAddress.slice(0, 7)}...{investor.walletAddress.slice(-4)}</span>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{getStatusBadge(investor)}</TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/investors/${investor.id}`}>View Details</Link>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={onResetPassword}>
                Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onFreezeClick}>
                {investor.isFrozen ? 'Unfreeze' : 'Freeze'} Address
            </DropdownMenuItem>
             <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={onDeleteClick}>
                Cancel Access
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}


export default function InvestorList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [totalInvestors, setTotalInvestors] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogInvestor, setDialogInvestor] = useState<Investor | null>(null);
  const [dialogAction, setDialogAction] = useState<'freeze' | 'delete' | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = () => {
        const companyId = localStorage.getItem('selectedCompanyId');
        setSelectedCompanyId(companyId);
        if (companyId) {
            fetch(`/api/companies/${companyId}`).then(res => res.json()).then(setCompany);
        } else {
            setCompany(null);
        }
    };

    loadCompany();
    window.addEventListener('companyChanged', loadCompany);

    return () => {
        window.removeEventListener('companyChanged', loadCompany);
    };
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'issuer' && !selectedCompanyId) {
        setInvestors([]);
        setTotalInvestors(0);
        setLoading(false);
        return;
    }
    
    setLoading(true);
    const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: ITEMS_PER_PAGE.toString(),
        onlyVerified: 'true'
    });
    
    if (userRole === 'issuer' && selectedCompanyId) {
        params.append('companyId', selectedCompanyId);
    }

    if (statusFilter !== 'all') {
        params.append('status', statusFilter);
    }
    if (searchQuery) {
        params.append('query', searchQuery);
    }

    const fetchInvestors = async () => {
        try {
            const response = await fetch(`/api/investors?${params.toString()}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setInvestors(data.data);
            setTotalInvestors(data.meta.total);
        } catch (error) {
            console.error("Failed to fetch investors:", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchInvestors();
  }, [currentPage, searchQuery, statusFilter, selectedCompanyId]);
  
  const totalPages = Math.ceil(totalInvestors / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCloseDialog = () => {
      setDialogInvestor(null);
      setDialogAction(null);
  }
  
  const handleToggleFreeze = async () => {
    if (!dialogInvestor) return;

    const newFrozenState = !dialogInvestor.isFrozen;

    try {
      const response = await fetch(`/api/investors/${dialogInvestor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFrozen: newFrozenState }),
      });
      if (!response.ok) throw new Error('Failed to update status');

      const updatedInvestor = await response.json();
      setInvestors(prev => prev.map(inv => (inv.id === dialogInvestor.id ? updatedInvestor : inv)));

      toast({
          title: `Address ${updatedInvestor.isFrozen ? 'Frozen' : 'Unfrozen'}`,
          description: `The wallet address for "${updatedInvestor.name}" has been updated.`,
      });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update status.' });
    } finally {
        handleCloseDialog();
    }
  };

  const handleDeleteInvestor = async () => {
    if (!dialogInvestor) return;

    try {
      const response = await fetch(`/api/investors/${dialogInvestor.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) throw new Error('Investor not found.');
        throw new Error('Failed to cancel access.');
      }
      
      setInvestors(prev => prev.filter(inv => inv.id !== dialogInvestor!.id));
      setTotalInvestors(prev => prev - 1);

      toast({
        title: 'Access Canceled',
        description: `The investor's access has been revoked.`,
      });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    } finally {
        handleCloseDialog();
    }
  };

  const handleResetPassword = (investorName: string) => {
    toast({
        title: 'Password Reset Sent',
        description: `A password reset link has been sent to ${investorName}.`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Investors</h1>
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
      </div>
    );
  }

  if (!selectedCompanyId && localStorage.getItem('userRole') === 'issuer') {
    const showKybBanner = company && company.kybStatus !== 'verified';
    const complianceProvidersCount = company?.complianceProviders?.length ?? 0;
    const showComplianceBanner = company && company.kybStatus === 'verified' && complianceProvidersCount < 3;
     return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-headline font-semibold">Investors</h1>
        </div>
        <div className="space-y-8">
          {showKybBanner && <KybBanner />}
          {showComplianceBanner && <IdentityProvidersBanner />}
        </div>
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4 mt-8">
            <UserPlus className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No company selected</h2>
            <p className="text-muted-foreground mb-4">
                Please select a company from the sidebar to view investors.
            </p>
        </div>
      </div>
    );
  }
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-between items-center p-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
  
  const pageTitle = `Investors`;

  return (
    <AlertDialog open={!!dialogAction} onOpenChange={(open) => !open && handleCloseDialog()}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-headline font-semibold">{pageTitle}</h1>
          <Button asChild>
              <Link href="/investors/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Investor
              </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Investors</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Search by name, email, wallet..."
                      className="pl-8 w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="whitelisted">Whitelisted</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                  </SelectContent>
              </Select>
              <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg ml-auto">
                  <Button
                      variant={view === 'card' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView('card')}
                      aria-label="Card View"
                  >
                      <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                      variant={view === 'table' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView('table')}
                      aria-label="Table View"
                  >
                      <List className="h-4 w-4" />
                  </Button>
              </div>
          </div>
        </div>


        {investors.length === 0 ? (
          <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
              <UserPlus className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No investors found</h2>
              <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filter." : `There are no whitelisted investors for this company.`}
              </p>
          </div>
        ) : view === 'card' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {investors.map(investor => (
                <InvestorCard
                    key={investor.id}
                    investor={investor}
                    onFreezeClick={() => { setDialogInvestor(investor); setDialogAction('freeze'); }}
                    onResetPassword={() => handleResetPassword(investor.name)}
                    onDeleteClick={() => { setDialogInvestor(investor); setDialogAction('delete'); }}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead className="hidden md:table-cell">Total Invested</TableHead>
                  <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.map(investor => (
                    <InvestorTableRow 
                        key={investor.id} 
                        investor={investor} 
                        onFreezeClick={() => { setDialogInvestor(investor); setDialogAction('freeze'); }}
                        onResetPassword={() => handleResetPassword(investor.name)}
                        onDeleteClick={() => { setDialogInvestor(investor); setDialogAction('delete'); }}
                    />
                ))}
              </TableBody>
            </Table>
            {renderPagination()}
          </Card>
        )}

        <AlertDialogContent>
            {dialogAction === 'freeze' && (
                <>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will {dialogInvestor?.isFrozen ? 'unfreeze' : 'freeze'} the wallet address for &quot;{dialogInvestor?.name}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleFreeze}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </>
            )}
            {dialogAction === 'delete' && (
                <>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to cancel access?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the investor &quot;{dialogInvestor?.name}&quot; and all associated data. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteInvestor} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancel Access</AlertDialogAction>
                    </AlertDialogFooter>
                </>
            )}
        </AlertDialogContent>
      </div>
    </AlertDialog>
  )
}
