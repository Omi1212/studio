
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AssetDetails, User, Issuer, ViewMode, Company } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import AssetIcon from '../ui/asset-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Rocket, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import KybBanner from '@/components/dashboard/kyb-banner';
import IdentityProvidersBanner from '@/components/dashboard/identity-providers-banner';

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

function AssetCard({ asset }: { asset: AssetDetails }) {
  const router = useRouter();
  
  const handleView = () => {
    if (asset.status === 'draft') {
        router.push(`/issue-asset/new?draft_id=${asset.id}`);
    } else {
        localStorage.setItem('selectedAssetId', asset.id);
        window.dispatchEvent(new Event('assetChanged'));
        router.push('/workspace');
    }
  };

  const networks = Array.isArray(asset.network) ? asset.network : [asset.network].filter(Boolean);
  const displayNetwork = networks.length > 0 ? networkMap[networks[0]] || networks[0] : 'N/A';
  const remainingCount = networks.length - 1;

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
        <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{displayNetwork}</span>
              {remainingCount > 0 && <Badge variant="secondary">+{remainingCount}</Badge>}
            </div>
        </div>
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Max Supply</span>
            <span className="font-medium font-mono">{asset.maxSupply ? asset.maxSupply.toLocaleString() : '--'}</span>
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

function AssetTable({ assets }: { assets: AssetDetails[] }) {
    const router = useRouter();

    const handleView = (asset: AssetDetails) => {
        if (asset.status === 'draft') {
            router.push(`/issue-asset/new?draft_id=${asset.id}`);
        } else {
            localStorage.setItem('selectedAssetId', asset.id);
            window.dispatchEvent(new Event('assetChanged'));
            router.push('/workspace');
        }
    };
    
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Asset</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead>Max Supply</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map(asset => {
                         const networks = Array.isArray(asset.network) ? asset.network : [asset.network].filter(Boolean);
                         const displayNetwork = networks.length > 0 ? networkMap[networks[0]] || networks[0] : 'N/A';
                         const remainingCount = networks.length - 1;
                        return (
                        <TableRow key={asset.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <AssetIcon asset={asset} className="h-8 w-8" />
                                    <div>
                                        <p className="font-medium">{asset.assetName}</p>
                                        <p className="text-sm text-primary">{asset.assetTicker}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span>{displayNetwork}</span>
                                    {remainingCount > 0 && <Badge variant="secondary">+{remainingCount}</Badge>}
                                </div>
                            </TableCell>
                            <TableCell className="font-mono">{asset.maxSupply ? asset.maxSupply.toLocaleString() : '--'}</TableCell>
                            <TableCell>{getStatusBadge(asset.status)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleView(asset)}>
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

export default function ExistingAssets({ view, setView, canCreate, company }: { view: ViewMode, setView: (mode: ViewMode) => void, canCreate?: boolean, company?: Company | null }) {
  const [assets, setAssets] = useState<AssetDetails[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchIssuerAndAssets = useCallback(async () => {
    setLoading(true);

    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        setLoading(false);
        return;
    }
    const currentUser: User = JSON.parse(userStr);

    if (currentUser.role !== 'issuer') {
        setAssets([]);
        setTotalAssets(0);
        setLoading(false);
        return;
    }

    try {
        const issuersRes = await fetch('/api/issuers?perPage=999');
        if (!issuersRes.ok) throw new Error("Failed to fetch issuers");
        const issuersData = await issuersRes.json();
        const currentIssuer = (issuersData.data || []).find((i: Issuer) => i.email === currentUser.email);
        
        if (!currentIssuer) {
            setAssets([]);
            setTotalAssets(0);
            setLoading(false);
            return;
        }

        const params = new URLSearchParams({
            page: currentPage.toString(),
            perPage: ITEMS_PER_PAGE.toString(),
            issuerId: currentIssuer.id
        });
        const assetsResponse = await fetch(`/api/assets?${params.toString()}`);
        if (!assetsResponse.ok) throw new Error("Failed to fetch assets");
        const assetsData = await assetsResponse.json();
        
        const mappedAssets = (assetsData.data || []).map((t: any) => ({
            ...t,
            decimals: t.decimals ?? 0,
            isFreezable: t.isFreezable ?? false,
            publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
            assetName: t.assetName || 'Untitled Asset',
            assetTicker: t.assetTicker || '---',
            network: Array.isArray(t.network) ? t.network : [t.network].filter(Boolean),
            maxSupply: t.maxSupply || 0,
        }));
        setAssets(mappedAssets);
        setTotalAssets(assetsData.meta.total);

    } catch (error) {
        console.error("Failed to fetch data:", error);
        setAssets([]);
        setTotalAssets(0);
    } finally {
        setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchIssuerAndAssets();
    window.addEventListener('assetChanged', fetchIssuerAndAssets);

    return () => {
        window.removeEventListener('assetChanged', fetchIssuerAndAssets);
    };
  }, [fetchIssuerAndAssets]);
  
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
        <div className="mb-12">
            <h2 className="text-2xl font-headline font-semibold mb-4">Your Assets</h2>
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
  
  if (assets.length === 0) {
      if (canCreate) {
        return (
          <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
              <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No assets found</h2>
              <p className="text-muted-foreground mb-4">Get started by launching your first asset using the button above.</p>
          </div>
        );
      }
      const showKybBanner = company && company.kybStatus !== 'verified';
      const showComplianceBanner = company && company.kybStatus === 'verified';

      return (
        <div className="space-y-8">
          {showKybBanner && <KybBanner />}
          {showComplianceBanner && <IdentityProvidersBanner />}
          <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
              <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Start by verifying your business</h2>
              <p className="text-muted-foreground mb-4">Please complete all verification steps to create a new asset.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline font-semibold">Your Assets</h2>
        <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg">
              <Button 
                variant={view === 'card' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setView('card')}
                >
                <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
                variant={view === 'table' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setView('table')}
                >
                <List className="h-4 w-4" />
            </Button>
        </div>
      </div>
        {view === 'card' ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map(asset => (
                        <AssetCard key={asset.id} asset={asset} />
                    ))}
                </div>
                 {renderPagination()}
            </>
        ) : (
            <>
                <AssetTable assets={assets} />
                {renderPagination()}
            </>
        )}
    </div>
  );
}
