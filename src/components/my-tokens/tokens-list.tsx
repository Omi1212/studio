'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { tokenData } from '@/lib/data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown, Send, Copy } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

function TokenRow({ token }: { token: (typeof tokenData)[0] }) {
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
        <div className="flex items-center p-4">
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
              <p className="font-medium font-mono">{token.balance}</p>
              <p className="text-sm text-muted-foreground font-mono">
                ${(token.balance * token.price).toFixed(2)}
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
        <CollapsibleContent className="p-6 bg-muted/20">
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
          {tokenData.map((token) => (
            <TokenRow key={token.id} token={token} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
