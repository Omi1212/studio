
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import type { TokenDetails } from '@/app/issue-token/page';
import { exampleTokens } from '@/lib/data';
import { useState, useEffect } from 'react';
import TokenIcon from '../ui/token-icon';

interface TokenCardProps {
  token: TokenDetails | (typeof exampleTokens)[0];
}

const networkMap: { [key: string]: string } = {
  spark: 'Spark',
  liquid: 'Liquid',
  rgb: 'RGB',
};

export default function TokenWorkspaceCard({ token }: TokenCardProps) {
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if ('tokenIcon' in token && token.tokenIcon instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(token.tokenIcon);
    }
  }, [token]);

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

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4 pb-4">
        {iconPreview ? (
            <Avatar className="h-12 w-12 text-xl font-bold">
                <AvatarImage src={iconPreview} alt={token.tokenName} />
                <AvatarFallback>{token.tokenName.charAt(0)}</AvatarFallback>
            </Avatar>
         ) : (
            <TokenIcon token={token} className="h-12 w-12 text-xl font-bold" />
         )}
        <div className="flex-1">
          <CardTitle className="text-lg">{token.tokenName}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span className="text-primary font-semibold">{token.tokenTicker}</span>
            <span className="text-xs text-muted-foreground">({networkMap[token.network] || token.network})</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div>{getStatusBadge()}</div>
         <p className="text-xs text-muted-foreground pt-2">
            Max Supply: {(token.maxSupply).toLocaleString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View</Button>
      </CardFooter>
    </Card>
  );
}
