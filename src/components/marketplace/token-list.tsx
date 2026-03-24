'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AssetDetails, ViewMode, SubscriptionStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import AssetIcon from '../ui/asset-icon';
import { Button } from '../ui/button';
import { ShoppingBag, LayoutGrid, List, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import PlaceOrder from './place-order';
import { Badge } from '../ui/badge';
import Image from 'next/image';

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    ark: 'Arkade Assets',
    taproot: 'Taproot Assets',
};

const networkIconMap: { [key: string]: React.ReactNode } = {
    spark: <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>,
    liquid: <Image src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" width={24} height={24} />,
    rgb: <Image src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" width={24} height={24} />,
    ark: <Image src="https://i.ibb.co/sdg2tRxK/imagen-2026-03-24-075321289.png" alt="Arkade Assets Logo" width={24} height={24} />,
    taproot: <Image src="https://docs.lightning.engineering/~gitbook/image?url=https%3A%2F%2F2545062540-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MIzyiDsFtJBYVyhr1nT%252Favatar-1602260100761.png%3Fgeneration%3D1602260100982225%26alt%3Dmedia&width=32&dpr=2&quality=100&sign=15d20b51&sv=2" alt="Taproot Assets Logo" width={24} height={24} />,
};

function AssetCard({ asset, onAction, subscriptionStatus }: { asset: AssetDetails, onAction: (asset: AssetDetails) => void, subscriptionStatus: SubscriptionStatus }) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/marketplace/${asset.id}`);
  };

  const getActionButton = () => {
    if (subscriptionStatus === 'approved') {
        return (
            <DialogTrigger asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => onAction(asset)}>Invest</Button>
            </DialogTrigger>
        )
    } else if (subscriptionStatus === 'pending') {
        return <Button className="w-full text-yellow-400 border-yellow-400" variant="outline" disabled>Pending</Button>;
    } else {
        return <Button variant="outline" className="w-full" onClick={() => onAction(asset)}>Subscribe</Button>;
    }
  }

  const networks = Array.isArray(asset.network) ? asset.network : [asset.network].filter(Boolean);

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
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Max Supply</span>
            <span className="font-medium font-mono">{asset.maxSupply ? asset.maxSupply.toLocaleString() : '--'}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
                {networks.map(net => (
                    <div key={net} className="h-6 w-6 flex items-center justify-center" title={networkMap[net] || net}>
                        {networkIconMap[net] || <span>{net}</span>}
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="w-full" onClick={handleView}>
          View
        </Button>
        {getActionButton()}
      </CardFooter>
    </Card>
  );
}

function AssetTableRow({ asset, onAction, subscriptionStatus }: { asset: AssetDetails, onAction: (asset: AssetDetails) => void, subscriptionStatus: SubscriptionStatus }) {
    const router = useRouter();

    const handleView = () => {
      router.push(`/marketplace/${asset.id}`);
    };
    
    const getActionButton = () => {
        if (subscriptionStatus === 'approved') {
            return (
                <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onAction(asset)}>Invest</Button>
                </DialogTrigger>
            );
        } else if (subscriptionStatus === 'pending') {
            return <Button size="sm" variant="outline" className="text-yellow-400 border-yellow-400" disabled>Pending</Button>;
        } else {
            return <Button variant="outline" size="sm" onClick={() => onAction(asset)}>Subscribe</Button>;
        }
    }
    
    const networks = Array.isArray(asset.network) ? asset.network : [asset.network].filter(Boolean);

    return (
        <TableRow onClick={handleView} className="cursor-pointer">
            <TableCell>
                <div className="flex items-center gap-3">
                    <AssetIcon asset={asset} className="h-8 w-8" />
                    <div>
                        <p className="font-medium">{asset.assetName}</p>
                        <p className="text-sm text-primary">{asset.assetTicker}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="font-mono">{asset.maxSupply ? asset.maxSupply.toLocaleString() : '--'}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {networks.map(net => (
                        <div key={net} className="h-6 w-6 flex items-center justify-center" title={networkMap[net] || net}>
                            {networkIconMap[net] || <span>{net}</span>}
                        </div>
                    ))}
                </div>
            </TableCell>
            <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" size="sm" onClick={handleView}>
                    View
                </Button>
                {getActionButton()}
            </TableCell>
        </TableRow>
    )
}

export default function AssetList() {
  const [allAssets, setAllAssets] = useState<AssetDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Record<string, SubscriptionStatus>>({});
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState<ViewMode>('card');
  const [selectedAsset, setSelectedAsset] = useState<AssetDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const handleCompanyChange = () => {
      const companyId = localStorage.getItem('selectedCompanyId');
      setSelectedCompanyId(companyId);
    };

    handleCompanyChange(); // Initial load
    window.addEventListener('companyChanged', handleCompanyChange);

    return () => {
      window.removeEventListener('companyChanged', handleCompanyChange);
    };
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'investor' && !selectedCompanyId) {
        setAllAssets([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    const params = new URLSearchParams({ perPage: '999' });
    if (selectedCompanyId) {
        params.append('companyId', selectedCompanyId);
    }
    
    Promise.all([
      fetch(`/api/assets?${params.toString()}`).then(res => res.json()),
      fetch('/api/investors/inv-001/subscriptions').then(res => res.ok ? res.json() : {})
    ]).then(([assetsResponse, subscriptionsData]: [any, Record<string, SubscriptionStatus>]) => {
      const activeAssets = (assetsResponse.data || [])
        .filter((t: AssetDetails) => t.status === 'active')
        .map((t: AssetDetails) => ({
          ...t,
          decimals: t.decimals ?? 0,
          isFreezable: t.isFreezable ?? false,
          assetName: t.assetName || 'Untitled Asset',
          assetTicker: t.assetTicker || '---',
          network: Array.isArray(t.network) ? t.network : [t.network].filter(Boolean),
          maxSupply: t.maxSupply || 0,
          price: t.price || 0,
        }));
      setAllAssets(activeAssets);
      setSubscriptions(subscriptionsData);
    }).catch(console.error)
    .finally(() => setLoading(false));

  }, [selectedCompanyId]);

  const filteredAssets = useMemo(() => {
    let filtered = [...allAssets];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(asset => (subscriptions[asset.id] || 'none') === filterStatus);
    }
    
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.assetName.toLowerCase().includes(lowercasedQuery) ||
        asset.assetTicker.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [allAssets, searchQuery, filterStatus, subscriptions]);
  
  const handleSubscriptionAction = async (asset: AssetDetails) => {
    const currentStatus = subscriptions[asset.id] || 'none';
    
    if (currentStatus === 'none') {
        const newSubscriptions = { ...subscriptions, [asset.id]: 'pending' as SubscriptionStatus };
        setSubscriptions(newSubscriptions);
        
        try {
            const response = await fetch('/api/investors/inv-001/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetId: asset.id, status: 'pending' }),
            });
            if (!response.ok) throw new Error('Failed to update subscription');
    
            toast({ title: 'Whitelisting Request Sent!', description: "Your request is now pending approval." });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not send request.' });
            // Revert state on error
            const revertedSubscriptions = { ...subscriptions };
            if (revertedSubscriptions[asset.id]) {
                delete revertedSubscriptions[asset.id];
            }
            setSubscriptions(revertedSubscriptions);
        }

    } else if (currentStatus === 'approved') {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    }
  };


  if (loading) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-headline font-semibold mb-4">Available Assets</h2>
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
  
  if (allAssets.length === 0) {
      return (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No assets available</h2>
            <p className="text-muted-foreground mb-4">There are no active asset offerings in the marketplace at this time for the selected company.</p>
        </div>
      );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="mb-12 space-y-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline font-semibold">Available Assets</h2>
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="none">Subscribe</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Invest</SelectItem>
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
        {filteredAssets.length === 0 ? (
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No assets match your search</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters to find what you&apos;re looking for.</p>
            </div>
        ) : view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssets.map(asset => (
                        <AssetCard 
                            key={asset.id} 
                            asset={asset} 
                            onAction={handleSubscriptionAction}
                            subscriptionStatus={subscriptions[asset.id] || 'none'}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Asset</TableHead>
                                <TableHead>Max Supply</TableHead>
                                <TableHead>Network</TableHead>
                                <TableHead className="text-right w-[25%]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssets.map(asset => (
                            <AssetTableRow 
                                    key={asset.id} 
                                    asset={asset} 
                                    onAction={handleSubscriptionAction}
                                    subscriptionStatus={subscriptions[asset.id] || 'none'}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
         {selectedAsset && (
            <DialogContent className='sm:max-w-lg'>
                <PlaceOrder 
                    asset={selectedAsset} 
                    price={selectedAsset.price || 0} 
                    isSubscribed={true}
                    onOrderPlaced={() => setIsModalOpen(false)}
                    assetName={selectedAsset.assetName}
                />
            </DialogContent>
        )}
    </Dialog>
  );
}
