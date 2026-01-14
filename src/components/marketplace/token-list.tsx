
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { exampleTokens } from '@/lib/data';
import type { TokenDetails, ViewMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TokenIcon from '../ui/token-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ShoppingBag, LayoutGrid, List } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';

type SubscriptionStatus = 'none' | 'pending' | 'approved';

function getStatusBadge(status: TokenDetails['status']) {
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

function TokenCard({ token, onAction, subscriptionStatus }: { token: TokenDetails, onAction: () => void, subscriptionStatus: SubscriptionStatus }) {
  const router = useRouter();

  const handleView = () => {
    localStorage.setItem('selectedTokenId', token.id);
    window.dispatchEvent(new Event('tokenChanged'));
    router.push(`/workspace/${token.id}`);
  };

  const getActionButton = () => {
    switch (subscriptionStatus) {
      case 'none':
        return <Button className="w-full" onClick={onAction}>Subscribe</Button>;
      case 'pending':
        return <Button className="w-full" variant="outline" disabled>Pending</Button>;
      case 'approved':
        return <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onAction}>Invest</Button>;
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
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            {getStatusBadge(token.status)}
        </div>
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

function TokenTableRow({ token, onAction, subscriptionStatus }: { token: TokenDetails, onAction: () => void, subscriptionStatus: SubscriptionStatus }) {
    const router = useRouter();

    const handleView = () => {
      localStorage.setItem('selectedTokenId', token.id);
      window.dispatchEvent(new Event('tokenChanged'));
      router.push(`/workspace/${token.id}`);
    };
    
    const getActionButton = () => {
        switch (subscriptionStatus) {
            case 'none':
                return <Button size="sm" onClick={onAction}>Subscribe</Button>;
            case 'pending':
                return <Button size="sm" variant="outline" disabled>Pending</Button>;
            case 'approved':
                return <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onAction}>Invest</Button>;
            default:
                return null;
        }
    }

    return (
        <TableRow>
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
            <TableCell>{getStatusBadge(token.status)}</TableCell>
            <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={handleView}>
                    View
                </Button>
                {getActionButton()}
            </TableCell>
        </TableRow>
    )
}

export default function TokenList({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Record<string, SubscriptionStatus>>({});
  const { toast } = useToast();

  useEffect(() => {
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const combinedTokens: TokenDetails[] = [...exampleTokens, ...storedTokens].map(t => ({
      ...t,
      decimals: t.decimals ?? 0,
      isFreezable: t.isFreezable ?? false,
      publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
      tokenName: t.tokenName || 'Untitled Token',
      tokenTicker: t.tokenTicker || '---',
      network: t.network || 'unknown',
      maxSupply: t.maxSupply || 0,
    })).filter(t => t.status === 'active'); // Only show active tokens in marketplace
    
    setAllTokens(combinedTokens);
    
    const storedSubscriptions = JSON.parse(localStorage.getItem('tokenSubscriptions') || '{}');
    setSubscriptions(storedSubscriptions);

    setLoading(false);
  }, []);
  
  const handleSubscriptionAction = (tokenId: string) => {
    const currentStatus = subscriptions[tokenId] || 'none';
    let newStatus: SubscriptionStatus = 'none';

    if (currentStatus === 'none') {
        newStatus = 'pending';
        toast({ title: 'Subscribed!', description: "Your subscription request has been sent and is now pending." });
    } else if (currentStatus === 'approved') {
        // Here you would navigate to an "Invest" page or open a modal
        toast({ title: 'Invest Action', description: "Redirecting to investment page..." });
        return;
    }

    const newSubscriptions = { ...subscriptions, [tokenId]: newStatus };
    setSubscriptions(newSubscriptions);
    localStorage.setItem('tokenSubscriptions', JSON.stringify(newSubscriptions));
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
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline font-semibold">Available Tokens</h2>
        <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg">
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
        {view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTokens.map(token => (
                    <TokenCard 
                        key={token.id} 
                        token={token} 
                        onAction={() => handleSubscriptionAction(token.id)}
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
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right w-[25%]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allTokens.map(token => (
                           <TokenTableRow 
                                key={token.id} 
                                token={token} 
                                onAction={() => handleSubscriptionAction(token.id)}
                                subscriptionStatus={subscriptions[token.id] || 'none'}
                            />
                        ))}
                    </TableBody>
                </Table>
            </Card>
        )}
    </div>
  );
}
