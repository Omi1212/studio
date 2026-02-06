'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TokenDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TokenIcon from '../ui/token-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Rocket, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { ViewMode } from '@/app/issue-token/page';

const ITEMS_PER_PAGE = 6;

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
        router.push('/workspace');
    }
  };

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
            router.push('/workspace');
        }
    };
    
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Token</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead>Max Supply</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.map(token => (
                        <TableRow key={token.id}>
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
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleView(token)}>
                                    {token.status === 'draft' ? 'Continue' : 'View'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default function ExistingTokens({ view, setView }: { view: ViewMode, setView: (mode: ViewMode) => void }) {
  const [tokens, setTokens] = useState<TokenDetails[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
    });
    fetch(`/api/tokens?${params.toString()}`)
        .then(res => res.json())
        .then((tokensResponse) => {
            const mappedTokens = tokensResponse.tokens.map((t: any) => ({
            ...t,
            decimals: t.decimals ?? 0,
            isFreezable: t.isFreezable ?? false,
            publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
            tokenName: t.tokenName || 'Untitled Token',
            tokenTicker: t.tokenTicker || '---',
            network: t.network || 'unknown',
            maxSupply: t.maxSupply || 0,
            }));
            setTokens(mappedTokens);
            setTotalTokens(tokensResponse.total);
        })
        .finally(() => setLoading(false));
  }, [currentPage]);
  
  const totalPages = Math.ceil(totalTokens / ITEMS_PER_PAGE);

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
            <h2 className="text-2xl font-headline font-semibold mb-4">Your Tokens</h2>
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
  
  if (tokens.length === 0) {
      return (
        <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4">
            <Rocket className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tokens found</h2>
            <p className="text-muted-foreground mb-4">Get started by launching your first token.</p>
            <Button asChild>
                <Link href="/issue-token/new">Create New Token</Link>
            </Button>
        </div>
      );
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline font-semibold">Your Tokens</h2>
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
                    {tokens.map(token => (
                        <TokenCard key={token.id} token={token} />
                    ))}
                </div>
                 {renderPagination()}
            </>
        ) : (
            <>
                <TokenTable tokens={tokens} />
                {renderPagination()}
            </>
        )}
    </div>
  );
}
