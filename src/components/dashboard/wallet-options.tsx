
'use client';

import { Asterisk, ExternalLink, Plus, Power, Copy, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  SheetClose,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

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

    const copyAddress = () => {
        const address = 'spark1pgssyd5f0685tu3v2hpqv2rx9cxu6vskyzjulwepzq79kd583gyw4z0gp92kjc';
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
            <AvatarImage src="https://placehold.co/40x40/7c3aed/ffffff/png?text=A" alt="User Avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span className="font-semibold">spa...kjc</span>
        </div>
        <div className="flex items-center gap-1">
          <SheetClose asChild>
            <Button variant="ghost" size="icon" onClick={onDisconnect}><Power className="h-5 w-5 text-red-500" /></Button>
          </SheetClose>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center text-center py-4">
        <p className="text-muted-foreground">Portfolio Balance</p>
        <p className="text-5xl font-bold">$0.00</p>
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

      <div className="pt-4">
        <h3 className="font-semibold mb-4">Portfolio</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" alt="Bitcoin" />
              <AvatarFallback>BTC</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Bitcoin</p>
              <p className="text-sm text-muted-foreground">0 BTC</p>
            </div>
          </div>
          <p className="font-mono">$0.00</p>
        </div>
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
