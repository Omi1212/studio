
import { Asterisk, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const XverseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white text-black rounded-full p-0.5">
        <path d="M9.35156 8.28125L12 12M12 12L14.6484 15.7188M12 12L9.42969 15.7188M12 12L14.7266 8.28125" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.3984 5.03906L15.2734 3.96094L12 7.67188L8.72656 3.96094L5.60156 5.03906L8.80469 8.82812L6.15625 12.3281L7.64062 14.9219L10.5 12.8906L12.0781 18.0234H11.9219L13.5 12.8906L16.3594 14.9219L17.8438 12.3281L15.1953 8.82812L18.3984 5.03906Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export default function WalletOptions() {
  return (
    <div className="grid gap-4 py-4">
      <Button
        variant="outline"
        className="flex h-14 w-full items-center justify-between rounded-lg px-4"
      >
        <div className="flex items-center gap-3">
          <XverseIcon />
          <span className="font-semibold">Connect with Xverse</span>
        </div>
        <ExternalLink className="h-5 w-5 text-muted-foreground" />
      </Button>
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
    </div>
  );
}
