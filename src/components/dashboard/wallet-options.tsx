
import { Asterisk, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  SheetClose,
} from "@/components/ui/sheet"

const XverseIcon = () => (
    <img src="https://spark.satsterminal.com/xverse.svg" alt="Xverse logo" className="h-8 w-8" />
)

interface WalletOptionsProps {
  onConnect: () => void;
}


export default function WalletOptions({ onConnect }: WalletOptionsProps) {
  const { toast } = useToast();

  const handleConnect = () => {
    // Simulate connection
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
