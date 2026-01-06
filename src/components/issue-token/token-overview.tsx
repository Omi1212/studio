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
import { CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TokenDetails } from '@/app/issue-token/page';

interface TokenOverviewProps {
  token: TokenDetails;
  onIssueNew: () => void;
}

export default function TokenOverview({
  token,
  onIssueNew,
}: TokenOverviewProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: text,
    });
  };

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <CardTitle className="text-2xl">Token Issued Successfully</CardTitle>
        <CardDescription>
          Your new token has been created on the network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border bg-muted/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Token ID</p>
              <p className="font-mono font-semibold">{token.id}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(token.id)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoItem label="Token Name" value={token.tokenName} />
          <InfoItem label="Token Ticker" value={token.tokenTicker} />
          <InfoItem label="Decimals" value={token.decimals.toString()} />
          <InfoItem
            label="Max Supply"
            value={token.maxSupply.toLocaleString()}
          />
          <InfoItem
            label="Is Freezable"
            value={token.isFreezable ? 'Yes' : 'No'}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onIssueNew} variant="outline" className="w-full">
          Issue Another Token
        </Button>
      </CardFooter>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg border">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
