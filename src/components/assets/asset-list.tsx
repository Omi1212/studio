
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AssetDetails, ViewMode, Issuer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import AssetIcon from '../ui/asset-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Rocket, LayoutGrid, List, Search } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ITEMS_PER_PAGE = 6;

function getStatusBadge(status: AssetDetails['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'frozen':
      return <Badge variant="destructive">Frozen</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

function AssetCard({ asset, issuer }: { asset: AssetDetails, issuer?: Issuer }) {
  const router = useRouter();
  
  const handleView = () => {
    if (asset.status === 'draft') {
        router.push(`/issue-asset/new?draft_id=${asset.id}`);
    } else {
        localStorage.setItem('selectedAssetId', asset.id);
        window.dispatchEvent(new Event('assetChanged'));
        router.push(`/workspace/${asset.id}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <AssetIcon asset={asset} className="h-10 w-10" />
          <div>
            <CardTitle className="text-lg">{asset.assetName}</CardTitle>
            <CardDescription className="text-primary font-bold">{asset.assetTicker}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            {getStatusBadge(asset.status)}
        </div>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">{(asset.network || []).map(n => networkMap[n] || n).join(', ')}</span>
        </div>
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Issuer</span>
            <span className="font-medium">{issuer?.name || 'N/A'}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleView}>
          {asset.status === 'draft' ? 'Continue' : 'View'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function AssetTable({ assets, issuers }: { assets: AssetDetails[], issuers: Issuer[] }) {
    const router = useRouter();

    const handleView = (asset: AssetDetails) => {
        if (asset.status === 'draft') {
            router.push(`/issue-asset/new?draft_id=${asset.id}`);
        } else {
            localStorage.setItem('selectedAssetId', asset.id);
            window.dispatchEvent(new Event('assetChanged'));
            router.push(`/workspace/${asset.id}`);
        }
    };
    
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30%]">Asset</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map(asset => {
                        const issuer = issuers.find(i => i.id === asset.issuerId);
                        return (
                        <TableRow key={asset.id} onClick={() => handleView(asset)} className="cursor-pointer">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <AssetIcon asset={asset} className="h-8 w-8" />
                                    <div>
                                        <p className="font-medium">{asset.assetName}</p>
                                        <p className="text-sm text-primary">{asset.assetTicker}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{issuer?.name || 'N/A'}</TableCell>
                            <TableCell>{(asset.network || []).map(n => networkMap[n] || n).join(', ')}</TableCell>
                            <TableCell>{getStatusBadge(asset.status)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                    {asset.status === 'draft' ? 'Continue' : 'View'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
        </Card>
    )
}

export default function AssetList() {
  const [assets, setAssets] = useState<AssetDetails[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: ITEMS_PER_PAGE.toString(),
    });
    if (statusFilter !== 'all') {
      params.append('status', statusFilter);
    }
    if (searchQuery) {
      params.append('query', searchQuery);
    }

    Promise.all([
      fetch(`/api/assets?${params.toString()}`).then(res => res.json()),
      fetch('/api/issuers').then(res => res.json()) // Fetch all issuers to map names
    ]).then(([assetsResponse, issuersResponse]) => {
      const combinedAssets: AssetDetails[] = assetsResponse.data.map((t: AssetDetails) => ({
        ...t,
        decimals: t.decimals ?? 0,
        isFreezable: t.isFreezable ?? false,
        publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
        assetName: t.assetName || 'Untitled Asset',
        assetTicker: t.assetTicker || '---',
        network: t.network || [],
        maxSupply: t.maxSupply || 0,
      }));
      setAssets(combinedAssets);
      setTotalAssets(assetsResponse.meta.total);
      setIssuers(issuersResponse.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [searchQuery, statusFilter, currentPage]);

  const totalPages = Math.ceil(totalAssets / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-between items-center pt-4">
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

  if (loading) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-headline font-semibold">Assets</h1>
            </div>
             {view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="h-64 animate-pulse bg-muted/50"></Card>
                    <Card className="h-64 animate-pulse bg-muted/50"></Card>
                    <Card className="h-64 animate-pulse bg-muted/50"></Card>
                </div>
            ) : (
                <Card className="h-64 animate-pulse bg-muted/50"></Card>
            )}
      </div>
    );
  }
  
  if (assets.length === 0 && !searchQuery && statusFilter === 'all') {
      return (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No assets found</h2>
            <p className="text-muted-foreground mb-4">Get started by launching an asset.</p>
            <Button asChild>
                <Link href="/issue-asset">Go to Launchpad</Link>
            </Button>
        </div>
      );
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-headline font-semibold">Assets</h1>
        </div>
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or ticker..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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

        {assets.length === 0 ? (
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No assets match your search</h2>
                <p className="text-muted-foreground mb-4">Try a different search term or filter.</p>
            </div>
        ) : view === 'card' ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map(asset => {
                    const issuer = issuers.find(i => i.id === asset.issuerId);
                    return <AssetCard key={asset.id} asset={asset} issuer={issuer} />
                    })}
                </div>
                {renderPagination()}
            </>
        ) : (
            <>
                <AssetTable assets={assets} issuers={issuers} />
                {renderPagination()}
            </>
        )}
    </div>
  );
}
