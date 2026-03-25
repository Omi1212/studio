'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ViewMode, User, AssetDetails, SubscriptionStatus, Company } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LayoutGrid, List, Search, FilePenLine } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import AssetIcon from '../ui/asset-icon';

type WhitelistRequest = User & {
  requestStatus: SubscriptionStatus;
  assetId: string;
  asset: AssetDetails;
};

const ITEMS_PER_PAGE = 10;

function getStatusBadge(request: WhitelistRequest) {
  switch (request.requestStatus) {
    case 'approved':
      return <Badge variant="outline" className="text-green-400 border-green-400">Accepted</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function RequestCard({ request }: { request: WhitelistRequest }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{request.name}</CardTitle>
              <CardDescription>{request.email}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Asset</span>
            <span className="font-medium">{request.asset.assetTicker}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Wallet</span>
            <span className="font-medium font-mono truncate">{request.walletAddress.slice(0, 7)}...{request.walletAddress.slice(-4)}</span>
        </div>
        {request.joinedDate && (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Joined Date</span>
            <span className="font-medium">{new Date(request.joinedDate).toLocaleDateString()}</span>
          </div>
        )}
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Status</span>
            {getStatusBadge(request)}
        </div>
      </CardContent>
      <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/whitelisting-requests/${request.id}?assetId=${request.assetId}`}>View</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}

function RequestTableRow({ request }: { request: WhitelistRequest }) {
  const router = useRouter();
  return (
    <TableRow onClick={() => router.push(`/whitelisting-requests/${request.id}?assetId=${request.assetId}`)} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{request.name}</p>
            <p className="text-sm text-muted-foreground">{request.email}</p>
          </div>
        </div>
      </TableCell>
       <TableCell className="hidden lg:table-cell">
        <span className="font-mono">{request.walletAddress.slice(0, 7)}...{request.walletAddress.slice(-4)}</span>
       </TableCell>
       <TableCell className="hidden sm:table-cell">{getStatusBadge(request)}</TableCell>
      <TableCell className="text-right">
        <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
            <Link href={`/whitelisting-requests/${request.id}?assetId=${request.assetId}`}>View</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}


export default function RequestList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetDetails | null>(null);
  const [assetCheckComplete, setAssetCheckComplete] = useState(false);

  const [allInvestors, setAllInvestors] = useState<User[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<Record<string, Record<string, SubscriptionStatus>>>({});
  const [allAssets, setAllAssets] = useState<AssetDetails[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const loadCompany = () => {
      const selectedCompanyId = localStorage.getItem('selectedCompanyId');
      if (selectedCompanyId) {
          fetch(`/api/companies/${selectedCompanyId}`).then(res => res.json()).then(setCompany);
      } else {
          setCompany(null);
      }
    };
    loadCompany();
    window.addEventListener('companyChanged', loadCompany);


    const initialFetch = async () => {
      setLoading(true);
      await Promise.all([
          fetch('/api/investors?perPage=999').then(res => res.json()),
          fetch('/api/investors/subscriptions').then(res => res.json()),
          fetch('/api/assets?perPage=999').then(res => res.json())
      ]).then(([usersResponse, subscriptionsResponse, assetsResponse]) => {
          setAllInvestors(usersResponse.data || []);
          setAllSubscriptions(subscriptionsResponse || {});
          setAllAssets(assetsResponse.data || []);
      }).catch(console.error).finally(() => setLoading(false));
    }
    initialFetch();

    return () => {
        window.removeEventListener('companyChanged', loadCompany);
    };
  }, []);

  useEffect(() => {
    if (allAssets.length === 0 && assetCheckComplete) return;

    const handleAssetChange = () => {
        const storedAssetId = localStorage.getItem('selectedAssetId');
        if (storedAssetId && allAssets.length > 0) {
            const foundAsset = allAssets.find(t => t.id === storedAssetId);
            setSelectedAsset(foundAsset || null);
        } else {
            setSelectedAsset(null);
        }
        setAssetCheckComplete(true);
    };

    handleAssetChange();
    window.addEventListener('assetChanged', handleAssetChange);
    
    return () => {
        window.removeEventListener('assetChanged', handleAssetChange);
    };
  }, [allAssets, assetCheckComplete]);

  const requests = useMemo(() => {
    if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset) {
        return [];
    }
      
    let allRequests: WhitelistRequest[] = [];
    
    Object.entries(allSubscriptions).forEach(([investorId, tokenSubs]) => {
        Object.entries(tokenSubs).forEach(([tokenId, status]) => {
            
            if (selectedAsset && tokenId !== selectedAsset.id) {
                return; // Skip if asset is selected and this subscription is not for it
            }

            const investor = allInvestors.find(inv => inv.id === investorId);
            const asset = allAssets.find(a => a.id === tokenId);

            if (investor && asset) {
                if(userRole === 'issuer' && company && asset.companyId === company.id) {
                    allRequests.push({ ...investor, requestStatus: status, assetId: tokenId, asset });
                }
                else if (userRole === 'agent' || userRole === 'superadmin') {
                     allRequests.push({ ...investor, requestStatus: status, assetId: tokenId, asset });
                }
            }
        });
    });

    let filtered = allRequests;
    if (statusFilter !== 'all') {
        const filterMap: Record<string, SubscriptionStatus> = { accepted: 'approved', pending: 'pending', rejected: 'rejected' };
        const mappedStatus = filterMap[statusFilter as keyof typeof filterMap];
        if (mappedStatus) {
            filtered = filtered.filter(req => req.requestStatus === mappedStatus);
        }
    }

    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(req => 
            req.name.toLowerCase().includes(lowerQuery) ||
            req.email.toLowerCase().includes(lowerQuery) ||
            req.walletAddress.toLowerCase().includes(lowerQuery)
        );
    }
    
    const statusOrder: Record<SubscriptionStatus, number> = { 'pending': 1, 'approved': 2, 'rejected': 3, 'none': 4 };
    filtered.sort((a, b) => {
        const orderA = statusOrder[a.requestStatus] || 5;
        const orderB = statusOrder[b.requestStatus] || 5;
        return orderA - orderB;
    });

    return filtered;

  }, [allSubscriptions, allInvestors, allAssets, statusFilter, searchQuery, userRole, company, selectedAsset]);

  const paginatedRequests = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [requests, currentPage]);
  
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold">Whitelisting Requests</h1>
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
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
  
  const noRequestsMessage = () => {
    if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset) {
        return {
            title: "No Asset Selected",
            description: "Please select an asset from the sidebar to view whitelisting requests."
        }
    }
    if (searchQuery || statusFilter !== 'all') {
        return {
            title: "No Requests Found",
            description: "Try adjusting your search or filters."
        }
    }
    return {
        title: "No Whitelisting Requests",
        description: "There are no pending requests at this time."
    }
  }

  const pageTitle = `Whitelisting Requests ${selectedAsset ? `for ${selectedAsset.assetTicker}` : ''}`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-semibold">{pageTitle}</h1>
      </div>

      <div className="space-y-4">
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
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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

       {paginatedRequests.length === 0 ? (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <FilePenLine className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{noRequestsMessage().title}</h2>
            <p className="text-muted-foreground mb-4">
                {noRequestsMessage().description}
            </p>
        </div>
      ) : view === 'card' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedRequests.map(request => (
              <RequestCard key={`${request.id}-${request.assetId}`} request={request} />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map(request => (
                  <RequestTableRow key={`${request.id}-${request.assetId}`} request={request} />
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </Card>
      )}
    </div>
  )
}
