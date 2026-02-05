
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown, Send, Copy } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import type { TokenDetails } from '@/lib/types';

interface PortfolioToken {
    id: string;
    name: string;
    ticker: string;
    price: number;
    balance: number;
    tokenId: string;
    publicKey: string;
    maxSupply: number;
    decimals: number;
    network: string;
}

function TokenRow({ token }: { token: PortfolioToken }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${fieldName} "${text}" has been copied.`,
    });
  };
  
  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="border-b">
        {/* Desktop View */}
        <div className="hidden md:flex items-center p-4">
            <div className="flex items-center gap-4 w-[35%]">
              <Avatar>
                <AvatarFallback>{token.ticker.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{token.ticker}</p>
                <p className="text-sm text-muted-foreground">{token.name}</p>
              </div>
            </div>
            <div className="w-[20%] text-right font-mono">
              ${token.price.toFixed(4)}
            </div>
            <div className="w-[25%] text-right">
              <p className="font-medium font-mono">{token.balance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground font-mono">
                ${(token.balance * token.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-[20%] flex items-center justify-end gap-2 px-6">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:rotate-180">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{token.ticker.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{token.ticker}</p>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:rotate-180">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-mono">${token.price.toFixed(4)}</p>
                </div>
                <div className="text-right">
                    <p className="text-muted-foreground">Balance</p>
                    <p className="font-mono">{token.balance.toLocaleString()}</p>
                    <p className="font-mono text-muted-foreground">${(token.balance * token.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
          </div>

        <CollapsibleContent className="p-6 pt-0 md:pt-6 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <InfoRow 
              label="Token ID" 
              value={token.tokenId}
              onCopy={() => copyToClipboard(token.tokenId, 'Token ID')}
            />
            <InfoRow 
              label="Token Public Key" 
              value={token.publicKey}
              onCopy={() => copyToClipboard(token.publicKey, 'Token Public Key')}
            />
            <div className="space-y-1">
              <p className="text-muted-foreground">Max Supply</p>
              <p className="font-medium font-mono">{token.maxSupply.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Decimals</p>
              <p className="font-medium font-mono">{token.decimals}</p>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function InfoRow({ label, value, onCopy }: { label: string; value: string, onCopy: () => void }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <p className="font-mono text-sm font-medium truncate flex-1">{value}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}


export default function TokensList() {
    const [portfolioTokens, setPortfolioTokens] = React.useState<PortfolioToken[]>([]);

    React.useEffect(() => {
        Promise.all([
            fetch('/api/investors/inv-001').then(res => res.json()),
            fetch('/api/tokens').then(res => res.json())
        ]).then(([investor, allTokens]: [any, TokenDetails[]]) => {
            if (!investor) return;

            const pTokens = investor.holdings.map((holding: any) => {
                const tokenDetail = allTokens.find(t => t.id === holding.tokenId);
                return {
                    id: holding.tokenId,
                    name: holding.tokenName,
                    ticker: holding.tokenTicker,
                    price: holding.value,
                    balance: holding.amount,
                    tokenId: holding.tokenId,
                    publicKey: `03a...${holding.tokenId.slice(-10)}`, // fake public key
                    maxSupply: tokenDetail?.maxSupply || 0,
                    decimals: tokenDetail?.decimals || 0,
                    network: tokenDetail?.network || 'spark',
                };
            });
            setPortfolioTokens(pTokens);
        }).catch(console.error);

    }, []);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="hidden md:flex border-b">
            <div className="w-[35%] px-4 py-3 font-medium text-muted-foreground text-sm">Asset</div>
            <div className="w-[20%] px-4 py-3 font-medium text-muted-foreground text-sm text-right">Price</div>
            <div className="w-[25%] px-4 py-3 font-medium text-muted-foreground text-sm text-right">Balance</div>
            <div className="w-[20%] px-4 py-3 font-medium text-muted-foreground text-sm text-center">Actions</div>
        </div>
        <div>
          {portfolioTokens.map((token) => (
            <TokenRow key={token.id} token={token} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
