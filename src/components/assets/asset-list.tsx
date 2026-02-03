
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { exampleTokens, issuersData } from '@/lib/data';
import type { TokenDetails, ViewMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TokenIcon from '../ui/token-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Rocket, LayoutGrid, List, Search } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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

function TokenCard({ token }: { token: TokenDetails }) {
  const router = useRouter();
  
  const handleView = () => {
    if (token.status === 'draft') {
        router.push(`/issue-token/new?draft_id=${token.id}`);
    } else {
        localStorage.setItem('selectedTokenId', token.id);
        window.dispatchEvent(new Event('tokenChanged'));
        router.push(`/workspace/${token.id}`);
    }
  };

  const issuer = issuersData.find(i => i.id === token.issuerId);

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
            <span className="text-muted-foreground">Issuer</span>
            <span className="font-medium">{issuer?.name || 'N/A'}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleView}>
          {token.status === 'draft' ? 'Continue' : 'View'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function TokenTable({ tokens }: { tokens: TokenDetails[] }) {
    const router = useRouter();

    const handleView = (token: TokenDetails) => {
        if (token.status === 'draft') {
            router.push(`/issue-token/new?draft_id=${token.id}`);
        } else {
            localStorage.setItem('selectedTokenId', token.id);
            window.dispatchEvent(new Event('tokenChanged'));
            router.push(`/workspace/${token.id}`);
        }
    };
    
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30%]">Token</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.map(token => {
                        const issuer = issuersData.find(i => i.id === token.issuerId);
                        return (
                        <TableRow key={token.id} onClick={() => handleView(token)} className="cursor-pointer">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <TokenIcon token={token} className="h-8 w-8" />
                                    <div>
                                        <p className="font-medium">{token.tokenName}</p>
                                        <p className="text-sm text-primary">{token.tokenTicker}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{issuer?.name || 'N/A'}</TableCell>
                            <TableCell>{networkMap[token.network] || token.network}</TableCell>
                            <TableCell>{getStatusBadge(token.status)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                    {token.status === 'draft' ? 'Continue' : 'View'}
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
  const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    }));
    setAllTokens(combinedTokens);
    setLoading(false);
  }, []);

  const filteredTokens = useMemo(() => {
    let filtered = [...allTokens];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(token => token.status === statusFilter);
    }
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(token =>
            token.tokenName.toLowerCase().includes(lowercasedQuery) ||
            token.tokenTicker.toLowerCase().includes(lowercasedQuery)
        );
    }
    return filtered;
  }, [allTokens, searchQuery, statusFilter]);

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
  
  if (allTokens.length === 0) {
      return (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No assets found</h2>
            <p className="text-muted-foreground mb-4">Get started by launching a token.</p>
            <Button asChild>
                <Link href="/issue-token">Go to Launchpad</Link>
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

        {filteredTokens.length === 0 ? (
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
                <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No assets match your search</h2>
                <p className="text-muted-foreground mb-4">Try a different search term or filter.</p>
            </div>
        ) : view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTokens.map(token => (
                    <TokenCard key={token.id} token={token} />
                ))}
            </div>
        ) : (
            <TokenTable tokens={filteredTokens} />
        )}
    </div>
  );
}
