'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Transfer, AssetDetails } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowRight, ArrowRightLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import KybBanner from '@/components/dashboard/kyb-banner';
import IdentityProvidersBanner from '@/components/dashboard/identity-providers-banner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_PER_PAGE = 10;

function getAmountClass(type: Transfer['type']) {
    switch (type) {
        case 'Mint':
            return 'text-green-500';
        case 'Burn':
            return 'text-red-500';
        default:
            return 'text-foreground';
    }
}

function getTypeBadge(type: Transfer['type']) {
    switch (type) {
        case 'Mint':
            return <Badge variant="outline" className="text-green-400 border-green-400">{type}</Badge>;
        case 'Burn':
            return <Badge variant="destructive">{type}</Badge>;
        case 'Transfer':
            return <Badge variant="secondary">{type}</Badge>;
        default:
            return <Badge>{type}</Badge>;
    }
}

export default function TransferList() {
  const router = useRouter();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<AssetDetails | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [assetCheckComplete, setAssetCheckComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    const handleAssetChange = async () => {
        const storedAssetId = localStorage.getItem('selectedAssetId');
        if (storedAssetId) {
            try {
                const response = await fetch(`/api/assets/${storedAssetId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSelectedAsset(data);
                } else {
                    setSelectedAsset(null);
                }
            } catch (error) {
                console.error("Failed to fetch asset:", error);
                setSelectedAsset(null);
            }
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

  }, []);

  useEffect(() => {
    if (!assetCheckComplete) {
        return;
    }
      
    const fetchTransfers = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: ITEMS_PER_PAGE.toString(),
      });

      if ((userRole === 'issuer' || userRole === 'agent') && selectedAsset) {
        params.append('assetTicker', selectedAsset.assetTicker);
      } else if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset) {
        setTransfers([]);
        setTotalTransfers(0);
        setLoading(false);
        return;
      }
      
      if (typeFilter !== 'all') {
          params.append('type', typeFilter);
      }
      if (networkFilter !== 'all') {
        params.append('network', networkFilter);
      }
      if (searchQuery) {
          params.append('query', searchQuery);
      }

      try {
        const response = await fetch(`/api/transfers?${params.toString()}`);
        const data = await response.json();
        setTransfers(data.data);
        setTotalTransfers(data.meta.total);
      } catch (error) {
        console.error("Failed to fetch transfers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransfers();
  }, [currentPage, searchQuery, typeFilter, networkFilter, selectedAsset, userRole, assetCheckComplete]);


  const totalPages = Math.ceil(totalTransfers / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filterControls = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by wallet..."
                className="pl-8 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
                <SelectItem value="Mint">Mint</SelectItem>
                <SelectItem value="Burn">Burn</SelectItem>
            </SelectContent>
        </Select>
        <Select value={networkFilter} onValueChange={setNetworkFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by network" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="spark">Spark</SelectItem>
                <SelectItem value="liquid">Liquid</SelectItem>
                <SelectItem value="rgb">RGB</SelectItem>
                <SelectItem value="taproot">Taproot Assets</SelectItem>
            </SelectContent>
        </Select>
    </div>
  );


  if (loading) {
    return (
      <Card className="h-96 animate-pulse bg-muted/50"></Card>
    );
  }

  if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset && assetCheckComplete) {
      return (
        <div className="space-y-8">
          <KybBanner />
          <IdentityProvidersBanner />
          <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <ArrowRightLeft className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No asset selected</h2>
            <p className="text-muted-foreground mb-4">Please select an asset from the sidebar to view transfers.</p>
          </div>
        </div>
      )
  }

  if (transfers.length === 0) {
      const noTransfersMessage = () => {
          if ((userRole === 'issuer' || userRole === 'agent') && !selectedAsset) {
              return {
                  title: "No asset selected or found",
                  description: "Please select an asset from the sidebar to view its transfers."
              }
          }
          if (searchQuery || typeFilter !== 'all' || networkFilter !== 'all') {
              return {
                  title: "No Transfers Found",
                  description: "Try adjusting your search or filters."
              }
          }
          return {
              title: "No Transfers Found",
              description: `There are no transfers for ${selectedAsset?.assetTicker} at this time.`
          }
      }
      return (
        <div className="space-y-4">
            {filterControls}
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                <ArrowRightLeft className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">{noTransfersMessage().title}</h2>
                <p className="text-muted-foreground mb-4">
                    {noTransfersMessage().description}
                </p>
            </div>
        </div>
      )
  }

  return (
    <div className="space-y-4">
        {filterControls}
        <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead></TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transfers.map((transfer) => (
                    <TableRow 
                    key={transfer.txId} 
                    onClick={() => router.push(`/transfers/${transfer.txId}`)}
                    className="cursor-pointer"
                    >
                    <TableCell>{getTypeBadge(transfer.type)}</TableCell>
                    <TableCell className="font-mono">{transfer.from.startsWith('spark1') ? `${transfer.from.slice(0, 7)}...${transfer.from.slice(-4)}` : transfer.from}</TableCell>
                    <TableCell className="px-0 text-muted-foreground"><ArrowRight className="h-4 w-4" /></TableCell>
                    <TableCell className={cn("font-mono", transfer.type === 'Burn' && 'text-red-500')}>{transfer.to.startsWith('spark1') ? `${transfer.to.slice(0, 7)}...${transfer.to.slice(-4)}` : transfer.to}</TableCell>
                    <TableCell className={cn("font-mono text-right", getAmountClass(transfer.type))}>
                        {transfer.amount.toLocaleString()} {transfer.assetTicker}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{new Date(transfer.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
            {totalPages > 1 && (
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
            )}
        </CardContent>
        </Card>
    </div>
  );
}
