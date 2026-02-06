'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { TokenDetails, ViewMode, SubscriptionStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TokenIcon from '../ui/token-icon';
import { Button } from '../ui/button';
import { ShoppingBag, LayoutGrid, List, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import PlaceOrder from './place-order';

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

function TokenCard({ token, onAction, subscriptionStatus }: { token: TokenDetails, onAction: (token: TokenDetails) => void, subscriptionStatus: SubscriptionStatus }) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/marketplace/${token.id}`);
  };

  const getActionButton = () => {
    switch (subscriptionStatus) {
      case 'none':
        return <Button variant="outline" className="w-full" onClick={() => onAction(token)}>Subscribe</Button>;
      case 'pending':
        return <Button className="w-full text-yellow-400 border-yellow-400" variant="outline" disabled>Pending</Button>;
      case 'approved':
         return (
            <DialogTrigger asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => onAction(token)}>Invest</Button>
            </DialogTrigger>
        )
      default:
        return null;
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <TokenIcon token={token} className="h-10 w-10" />
          <div>
            <CardTitle className="text-lg">{token.tokenName}</CardTitle>
            <CardDescription className="text-primary font-bold">{token.tokenTicker}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">{networkMap[token.network] || token.network}</span>
        </div>
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Max Supply</span>
            <span className="font-medium font-mono">{token.maxSupply ? token.maxSupply.toLocaleString() : '--'}</span>
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

function TokenTableRow({ token, onAction, subscriptionStatus }: { token: TokenDetails, onAction: (token: TokenDetails) => void, subscriptionStatus: SubscriptionStatus }) {
    const router = useRouter();

    const handleView = () => {
      router.push(`/marketplace/${token.id}`);
    };
    
    const getActionButton = () => {
        switch (subscriptionStatus) {
            case 'none':
                return <Button variant="outline" size="sm" onClick={() => onAction(token)}>Subscribe</Button>;
            case 'pending':
                return <Button size="sm" variant="outline" className="text-yellow-400 border-yellow-400" disabled>Pending</Button>;
            case 'approved':
                return (
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onAction(token)}>Invest</Button>
                    </DialogTrigger>
                );
            default:
                return null;
        }
    }

    return (
        <TableRow onClick={handleView} className="cursor-pointer">
            <TableCell>
                <div className="flex items-center gap-3">
                    <TokenIcon token={token} className="h-8 w-8" />
                    <div>
                        <p className="font-medium">{token.tokenName}</p>
                        <p className="text-sm text-primary">{token.tokenTicker}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>{networkMap[token.network] || token.network}</TableCell>
            <TableCell className="font-mono">{token.maxSupply ? token.maxSupply.toLocaleString() : '--'}</TableCell>
            <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" size="sm" onClick={handleView}>
                    View
                </Button>
                {getActionButton()}
            </TableCell>
        </TableRow>
    )
}

export default function TokenList() {
  const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Record<string, SubscriptionStatus>>({});
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState<ViewMode>('card');
  const [selectedToken, setSelectedToken] = useState<TokenDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/tokens?perPage=999').then(res => res.json()),
      fetch('/api/investors/inv-001/subscriptions').then(res => res.ok ? res.json() : {})
    ]).then(([tokensResponse, subscriptionsData]: [any, Record<string, SubscriptionStatus>]) => {
      const activeTokens = (tokensResponse.data || [])
        .filter((t: TokenDetails) => t.status === 'active')
        .map((t: TokenDetails) => ({
          ...t,
          decimals: t.decimals ?? 0,
          isFreezable: t.isFreezable ?? false,
          publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
          tokenName: t.tokenName || 'Untitled Token',
          tokenTicker: t.tokenTicker || '---',
          network: t.network || 'unknown',
          maxSupply: t.maxSupply || 0,
          price: t.price || 0,
        }));
      setAllTokens(activeTokens);
      setSubscriptions(subscriptionsData);
    }).catch(console.error)
    .finally(() => setLoading(false));

  }, []);

  const filteredTokens = useMemo(() => {
    let filtered = [...allTokens];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(token => (subscriptions[token.id] || 'none') === filterStatus);
    }
    
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(token => 
        token.tokenName.toLowerCase().includes(lowercasedQuery) ||
        token.tokenTicker.toLowerCase().includes(lowercasedQuery)
      );
    }

    return filtered;
  }, [allTokens, searchQuery, filterStatus, subscriptions]);
  
  const handleSubscriptionAction = async (token: TokenDetails) => {
    const currentStatus = subscriptions[token.id] || 'none';
    
    if (currentStatus === 'none') {
        const newSubscriptions = { ...subscriptions, [token.id]: 'pending' as SubscriptionStatus };
        setSubscriptions(newSubscriptions);
        
        try {
            const response = await fetch('/api/investors/inv-001/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId: token.id, status: 'pending' }),
            });
            if (!response.ok) throw new Error('Failed to update subscription');
    
            toast({ title: 'Whitelisting Request Sent!', description: "Your request is now pending approval." });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not send request.' });
            // Revert state on error
            const revertedSubscriptions = { ...subscriptions };
            if (revertedSubscriptions[token.id]) {
                delete revertedSubscriptions[token.id];
            }
            setSubscriptions(revertedSubscriptions);
        }

    } else if (currentStatus === 'approved') {
        setSelectedToken(token);
        setIsModalOpen(true);
    }
  };


  if (loading) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-headline font-semibold mb-4">Available Tokens</h2>
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
  
  if (allTokens.length === 0) {
      return (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tokens available</h2>
            <p className="text-muted-foreground mb-4">There are no active token offerings in the marketplace at this time.</p>
        </div>
      );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="mb-12 space-y-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline font-semibold">Available Tokens</h2>
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
        {filteredTokens.length === 0 ? (
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No tokens match your search</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters to find what you&apos;re looking for.</p>
            </div>
        ) : view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTokens.map(token => (
                        <TokenCard 
                            key={token.id} 
                            token={token} 
                            onAction={handleSubscriptionAction}
                            subscriptionStatus={subscriptions[token.id] || 'none'}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Token</TableHead>
                                <TableHead>Network</TableHead>
                                <TableHead>Max Supply</TableHead>
                                <TableHead className="text-right w-[25%]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTokens.map(token => (
                            <TokenTableRow 
                                    key={token.id} 
                                    token={token} 
                                    onAction={handleSubscriptionAction}
                                    subscriptionStatus={subscriptions[token.id] || 'none'}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
         {selectedToken && (
            <DialogContent className='sm:max-w-lg'>
                <PlaceOrder 
                    token={selectedToken} 
                    price={selectedToken.price || 0} 
                    isSubscribed={true}
                    onOrderPlaced={() => setIsModalOpen(false)}
                    tokenName={selectedToken.tokenName}
                />
            </DialogContent>
        )}
    </Dialog>
  );
}
