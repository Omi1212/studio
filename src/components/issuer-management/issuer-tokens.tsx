'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TokenDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TokenIcon from '../ui/token-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Rocket } from 'lucide-react';

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

export default function IssuerTokens({ issuerId }: { issuerId: string }) {
  const [issuerTokens, setIssuerTokens] = useState<TokenDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tokens?perPage=999')
      .then(res => res.json())
      .then((tokensResponse) => {
        const allTokens = tokensResponse.data || [];
        const filteredTokens = allTokens.filter((token: TokenDetails) => token.issuerId === issuerId);
        setIssuerTokens(filteredTokens);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [issuerId]);

  if (loading) {
    return (
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
    );
  }
  
  return (
    <div>
        <h2 className="text-xl font-semibold mb-4">Issued Tokens</h2>
        {issuerTokens.length === 0 ? (
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-48 flex flex-col items-center justify-center text-center p-4">
                <Rocket className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tokens Issued</h3>
                <p className="text-muted-foreground">This issuer has not launched any tokens yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issuerTokens.map(token => (
                    <TokenCard key={token.id} token={token} />
                ))}
            </div>
        )}
    </div>
  );
}
