
'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { TokenDetails } from '@/lib/types';
import TokenIcon from '../ui/token-icon';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Copy, Pause, BarChart, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface TokenSummaryCardProps {
    token: TokenDetails;
}

function InfoRow({ label, value, onCopy }: { label: string; value: string | React.ReactNode, onCopy?: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
      <p className="text-sm text-muted-foreground w-32 shrink-0">{label}</p>
      <div className="flex items-center gap-2 w-full">
        <div className="font-mono text-sm font-medium truncate flex-1">{value}</div>
        {onCopy && (
            <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onCopy}
            >
            <Copy className="w-4 h-4" />
            </Button>
        )}
      </div>
    </div>
  );
}


export default function TokenSummaryCard({ token }: TokenSummaryCardProps) {
    const { toast } = useToast();

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied to clipboard!',
            description: `${fieldName} has been copied.`,
        });
    };

    const getStatusBadge = () => {
        switch (token.status) {
          case 'active':
            return <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">Active</Badge>;
          case 'pending':
            return <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">Pending Review</Badge>;
          case 'frozen':
            return <Badge variant="destructive">Frozen</Badge>;
          default:
            return <Badge variant="secondary">Unknown</Badge>;
        }
    }


  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <TokenIcon token={token} className="h-12 w-12 text-xl font-bold" />
                 <div>
                  <h2 className="text-xl font-bold">{token.tokenTicker}</h2>
                  <p className="text-muted-foreground">{token.tokenName}</p>
                </div>
            </div>
            <Button>
                Token actions
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>

        <Separator />

        <div className="divide-y divide-border">
            <InfoRow 
                label="Token Address" 
                value={token.id} 
                onCopy={() => copyToClipboard(token.id, 'Token Address')} 
            />
             <InfoRow 
                label="Status" 
                value={getStatusBadge()}
            />
             <InfoRow 
                label="Valuation" 
                value="-"
            />
        </div>
        
        <Separator />

        <div className="flex gap-4">
            <Button variant="outline">
                <Pause className="mr-2 h-4 w-4" />
                Pause token
            </Button>
            <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Set valuation
            </Button>
        </div>


      </CardContent>
    </Card>
  );
}
