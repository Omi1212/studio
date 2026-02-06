'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ViewMode, TokenDetails, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical, LayoutGrid, List, UserPlus, Snowflake, Search, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import TokenIcon from '../ui/token-icon';


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

function InvestorCard({ investor, onToggleFreeze }: { investor: Investor, onToggleFreeze: () => void }) {
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
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Snowflake className="mr-2 h-4 w-4" /> {investor.isFrozen ? 'Unfreeze' : 'Freeze'} Address
                </DropdownMenuItem>
              </AlertDialogTrigger>
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

function InvestorTableRow({ investor, selectedToken, onToggleFreeze }: { investor: Investor, selectedToken: TokenDetails | null, onToggleFreeze: () => void }) {
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
      <TableCell className="hidden sm:table-cell">
        {selectedToken && (
             <div className="flex items-center gap-2">
                <TokenIcon token={selectedToken} className="h-6 w-6" />
                <span className="font-medium text-primary">{selectedToken.tokenTicker}</span>
            </div>
        )}
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
             <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {investor.isFrozen ? 'Unfreeze' : 'Freeze'} Address
                </DropdownMenuItem>
             </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}


export default function InvestorList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
  const [dialogInvestor, setDialogInvestor] = useState<Investor | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/investors').then(res => res.json()),
      fetch('/api/tokens').then(res => res.json())
    ]).then(([investorsData, tokensData]) => {
      setInvestors(investorsData);
      setAllTokens(tokensData);
    }).catch(console.error).finally(() => setLoading(false));

    const handleTokenChange = () => {
        const storedTokenId = localStorage.getItem('selectedTokenId');
        if (storedTokenId && allTokens.length > 0) {
            const foundToken = allTokens.find(t => t.id === storedTokenId);
            setSelectedToken(foundToken || null);
        } else {
            setSelectedToken(null);
        }
    };

    handleTokenChange();
    window.addEventListener('tokenChanged', handleTokenChange);
    
    return () => {
        window.removeEventListener('tokenChanged', handleTokenChange);
    };

  }, [allTokens]);

  const filteredInvestors = useMemo(() => {
    if (!selectedToken) return [];

    let filtered = investors.filter(investor => 
        investor.kycStatus === 'verified' &&
        investor.transactions?.some(tx => tx.token.id === selectedToken.id)
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => {
        if (statusFilter === 'frozen') return inv.isFrozen;
        if (statusFilter === 'whitelisted') return !inv.isFrozen;
        return true;
      });
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.name.toLowerCase().includes(lowercasedQuery) ||
        inv.email.toLowerCase().includes(lowercasedQuery) ||
        inv.walletAddress.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [investors, searchQuery, statusFilter, selectedToken]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, selectedToken]);

  const totalPages = Math.ceil(filteredInvestors.length / ITEMS_PER_PAGE);
  const paginatedInvestors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInvestors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvestors, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
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
        setDialogInvestor(null);
    }
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Investors</h1>
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
      </div>
    );
  }

  if (!selectedToken) {
     return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-headline font-semibold">Investors</h1>
        </div>
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <UserPlus className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Token Selected</h2>
            <p className="text-muted-foreground mb-4">
                Please select a token from the sidebar to view its investors.
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

  return (
    <AlertDialog onOpenChange={() => setDialogInvestor(null)}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-headline font-semibold">Investors {selectedToken && `for ${selectedToken.tokenTicker}`}</h1>
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


        {paginatedInvestors.length === 0 ? (
          <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
              <UserPlus className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No investors found</h2>
              <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filter." : `There are no whitelisted investors for ${selectedToken?.tokenTicker}.`}
              </p>
          </div>
        ) : view === 'card' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedInvestors.map(investor => (
                    <InvestorCard 
                        key={investor.id} 
                        investor={investor} 
                        onToggleFreeze={() => setDialogInvestor(investor)} 
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
                  <TableHead className="hidden sm:table-cell">Token</TableHead>
                  <TableHead className="hidden md:table-cell">Total Invested</TableHead>
                  <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvestors.map(investor => (
                    <InvestorTableRow 
                        key={investor.id} 
                        investor={investor} 
                        selectedToken={selectedToken} 
                        onToggleFreeze={() => setDialogInvestor(investor)} 
                    />
                ))}
              </TableBody>
            </Table>
            {renderPagination()}
          </Card>
        )}
        <AlertDialogContent>
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
        </AlertDialogContent>
      </div>
    </AlertDialog>
  )
}
