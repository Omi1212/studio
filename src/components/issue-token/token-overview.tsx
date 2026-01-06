
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
import { Copy, Info, Globe, Coins, Flame, Snowflake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TokenDetails } from '@/app/issue-token/page';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface TokenOverviewProps {
  token: TokenDetails;
}

export default function TokenOverview({
  token
}: TokenOverviewProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${fieldName} "${text}" has been copied.`,
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Token Overview</AlertTitle>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 text-xl font-bold">
                  <AvatarFallback>{token.tokenName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{token.tokenName}</h2>
                  <p className="text-primary">{token.tokenTicker}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>
            </div>

            <div className="space-y-4">
              <InfoRow 
                label="Token Public Key" 
                value={token.publicKey} 
                onCopy={() => copyToClipboard(token.publicKey, 'Token Public Key')} 
              />
              <InfoRow 
                label="Token ID" 
                value={token.id} 
                onCopy={() => copyToClipboard(token.id, 'Token ID')}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                    <p className="text-muted-foreground">Decimals</p>
                    <p className="font-medium">{token.decimals}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground">Is Freezable</p>
                    <p className="font-medium">{token.isFreezable ? 'Yes' : 'No'}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground">Holders</p>
                    <p className="font-medium">--</p>
                </div>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supply Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Max Supply</span>
              <span className="font-medium">{token.maxSupply.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Total Supply</span>
              <span className="font-medium">0 / {token.maxSupply.toLocaleString()}</span>
            </div>
            <Progress value={0} />
             <div className="text-right text-sm text-muted-foreground">0%</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Globe className="mr-2 h-4 w-4" />
              View on Sparkscan
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Token Actions</CardTitle>
            <CardDescription>Perform actions on this token.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline">
                <Coins className="mr-2 h-4 w-4" />
                Mint Tokens
            </Button>
            <Button variant="outline">
                <Flame className="mr-2 h-4 w-4" />
                Burn Tokens
            </Button>
            <Button variant="outline">
                <Snowflake className="mr-2 h-4 w-4" />
                Freeze Tokens
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, onCopy }: { label: string; value: string, onCopy: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground w-40 shrink-0">{label}</p>
      <div className="flex items-center gap-2 w-full">
        <p className="font-mono text-sm font-medium truncate flex-1">{value}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onCopy}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
