'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { exampleTokens } from '@/lib/data';
import type { TokenDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TokenIcon from '../ui/token-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';

function TokenCard({ token }: { token: TokenDetails }) {
  const router = useRouter();

  const getStatusBadge = () => {
    switch (token.status) {
      case 'active':
        return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
      case 'frozen':
        return <Badge variant="destructive">Frozen</Badge>;
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

  const handleViewInWorkspace = () => {
    localStorage.setItem('selectedTokenId', token.id);
    window.dispatchEvent(new Event('tokenChanged'));
    router.push('/workspace');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <TokenIcon token={token} className="h-10 w-10" />
            <div>
              <CardTitle className="text-lg">{token.tokenName}</CardTitle>
              <CardDescription className="text-primary font-bold">{token.tokenTicker}</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">{networkMap[token.network] || token.network}</span>
        </div>
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Max Supply</span>
            <span className="font-medium font-mono">{token.maxSupply.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleViewInWorkspace}>View in Workspace</Button>
      </CardFooter>
    </Card>
  );
}


export default function ExistingTokens() {
  const [allTokens, setAllTokens] = useState<TokenDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTokens: TokenDetails[] = JSON.parse(localStorage.getItem('createdTokens') || '[]');
    const combinedTokens: TokenDetails[] = [...exampleTokens, ...storedTokens].map(t => ({
      ...t,
      decimals: t.decimals ?? 0,
      isFreezable: t.isFreezable ?? false,
      publicKey: t.publicKey ?? `02f...${t.id.slice(-10)}`,
    }));
    setAllTokens(combinedTokens);
    setLoading(false);
  }, []);

  if (loading) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-headline font-semibold mb-4">Your Tokens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="h-56 animate-pulse bg-muted/50"></Card>
                <Card className="h-56 animate-pulse bg-muted/50"></Card>
                <Card className="h-56 animate-pulse bg-muted/50"></Card>
            </div>
      </div>
    );
  }
  
  if (allTokens.length === 0) {
      return null;
  }

  return (
    <div className="mb-12">
        <h2 className="text-2xl font-headline font-semibold mb-4">Your Tokens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTokens.map(token => (
                <TokenCard key={token.id} token={token} />
            ))}
        </div>
    </div>
  );
}
