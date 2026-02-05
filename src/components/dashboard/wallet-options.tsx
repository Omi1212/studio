
'use client';

import { Asterisk, ExternalLink, Plus, Power, Copy, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  SheetClose,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import type { User } from "@/lib/types";
import TokenIcon from "../ui/token-icon";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";

const XverseIcon = () => (
    <img src="https://spark.satsterminal.com/xverse.svg" alt="Xverse logo" className="h-8 w-8" />
)

interface WalletOptionsProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function ConnectedView({ onDisconnect }: { onDisconnect: () => void }) {
    const { toast } = useToast();
    const [investor, setInvestor] = useState<any | null>(null);
    const [crypto, setCrypto] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            fetch('/api/investors/inv-001').then(res => res.json()),
            fetch('/api/crypto').then(res => res.json())
        ]).then(([investorData, cryptoData]) => {
            setInvestor(investorData);
            setCrypto(cryptoData);
        }).catch(console.error);
    }, []);

    const totalValue = investor?.holdings.reduce((acc: number, token: any) => acc + token.amount * token.value, 0) || 0;
    const bitcoin = crypto.find(c => c.ticker === 'BTC');


    const copyAddress = () => {
        const address = investor?.walletAddress || 'spark1pgssyd5f0685tu3v2hpqv2rx9cxu6vskyzjulwepzq79kd583gyw4z0gp92kjc';
        navigator.clipboard.writeText(address);
        toast({
            title: 'Address Copied!',
            description: 'Your wallet address has been copied to the clipboard.',
        });
    }
  return (
    <div className="flex flex-col h-full pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
             <AvatarFallback>{investor ? investor.name.charAt(0) : 'A'}</AvatarFallback>
          </Avatar>
          <span className="font-semibold font-mono text-sm">{investor ? `${investor.walletAddress.slice(0, 10)}...${investor.walletAddress.slice(-4)}` : 'spark1pg...92kjc'}</span>
        </div>
        <div className="flex items-center gap-1">
          <SheetClose asChild>
            <Button variant="ghost" size="icon" onClick={onDisconnect}><Power className="h-5 w-5 text-red-500" /></Button>
          </SheetClose>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center text-center py-4">
        <p className="text-muted-foreground">Portfolio Balance</p>
        <p className="text-5xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mb-8">
        <div>
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full mx-auto mb-2"><ArrowDownToLine /></Button>
          <p className="text-sm">Receive</p>
        </div>
        <div>
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full mx-auto mb-2"><ArrowUpFromLine /></Button>
          <p className="text-sm">Send</p>
        </div>
        <div>
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full mx-auto mb-2" onClick={copyAddress}><Copy /></Button>
          <p className="text-sm">Copy</p>
        </div>
      </div>

      <Separator />

      <div className="pt-4 flex-1 flex flex-col min-h-0">
        <h3 className="font-semibold mb-4">Portfolio</h3>
        <ScrollArea className="flex-1 -mx-4">
            <div className="space-y-4 px-4">
                {bitcoin && (
                    <div key={bitcoin.ticker} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" alt="Bitcoin logo" />
                            </Avatar>
                            <div>
                                <p className="font-semibold">{bitcoin.name}</p>
                                <p className="text-sm text-muted-foreground">{bitcoin.balance.toLocaleString()} {bitcoin.ticker}</p>
                            </div>
                        </div>
                        <p className="font-mono">${(bitcoin.balance * bitcoin.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                )}
                {investor?.holdings?.map((token:any) => (
                    <div key={token.tokenId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TokenIcon token={token} className="h-10 w-10" />
                            <div>
                            <p className="font-semibold">{token.tokenName}</p>
                            <p className="text-sm text-muted-foreground">{token.amount.toLocaleString()} {token.tokenTicker}</p>
                            </div>
                        </div>
                        <p className="font-mono">${(token.amount * token.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                ))}
                {!bitcoin && (!investor?.holdings || investor.holdings.length === 0) && (
                    <div className="text-center text-muted-foreground py-8">
                        No assets in portfolio.
                    </div>
                )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}


function DisconnectedView({ onConnect }: { onConnect: () => void }) {
    const { toast } = useToast();

    const handleConnect = () => {
        onConnect();
        toast({
            title: 'Wallet Connected',
            description: 'Your Xverse Wallet is now connected.',
        });
    };
    return (
        <div className="grid gap-4 py-4">
            <SheetClose asChild>
                <Button
                    variant="outline"
                    className="flex h-14 w-full items-center justify-between rounded-lg px-4"
                    onClick={handleConnect}
                >
                    <div className="flex items-center gap-3">
                        <XverseIcon />
                        <span className="font-semibold">Connect with Xverse</span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                </Button>
            </SheetClose>
            <SheetClose asChild>
                <Button
                    variant="outline"
                    className="flex h-14 w-full items-center justify-between rounded-lg px-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex-center h-6 w-6 rounded-full bg-muted-foreground/20">
                            <Asterisk className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">Create Spark Wallet</span>
                    </div>
                    <Plus className="h-5 w-5 text-muted-foreground" />
                </Button>
            </SheetClose>
            <SheetClose asChild>
                <Button
                    variant="outline"
                    className="flex h-14 w-full items-center justify-between rounded-lg px-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex-center h-6 w-6 rounded-full bg-muted-foreground/20">
                            <Asterisk className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">Import Wallet</span>
                    </div>
                    <Plus className="h-5 w-5 text-muted-foreground" />
                </Button>
            </SheetClose>
        </div>
    );
}

export default function WalletOptions({ isConnected, onConnect, onDisconnect }: WalletOptionsProps) {
  if (isConnected) {
    return <ConnectedView onDisconnect={onDisconnect} />;
  }

  return <DisconnectedView onConnect={onConnect} />;
}
