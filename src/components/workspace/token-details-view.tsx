'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Coins, Flame, Snowflake, TrendingUp, BarChart, CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AssetDetails, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { useState, useEffect } from 'react';
import AssignedAgents from './assigned-agents';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from 'next/image';

interface AssetDetailsViewProps {
  asset: AssetDetails;
  view?: 'dashboard' | 'workspace';
  userRole?: User['role'] | null;
}

function KpiCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

const assetTypes = [
    { value: 'security_token', label: 'Security Token' },
    { value: 'utility_token', label: 'Utility Token' },
    { value: 'stablecoin', label: 'Stablecoin' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' },
];

const networkIconMap: { [key: string]: React.ReactNode } = {
    spark: <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>,
    liquid: <Image src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" width={24} height={24} />,
    rgb: <Image src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" width={24} height={24} />,
    taproot: <Image src="https://docs.lightning.engineering/~gitbook/image?url=https%3A%2F%2F2545062540-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MIzyiDsFtJBYVyhr1nT%252Favatar-1602260100761.png%3Fgeneration%3D1602260100982225%26alt%3Dmedia&width=32&dpr=2&quality=100&sign=15d20b51&sv=2" alt="Taproot Assets Logo" width={24} height={24} />,
};

const NetworkIcons = ({ networks }: { networks: string[] }) => (
    <div className="flex items-center gap-2">
        {networks.map(net => (
            <div key={net} className="h-6 w-6 flex items-center justify-center" title={net}>
                {networkIconMap[net] || <span>{net}</span>}
            </div>
        ))}
    </div>
);

function OverviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-muted-foreground">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  );
}


export default function AssetDetailsView({
  asset,
  view = 'workspace',
  userRole,
}: AssetDetailsViewProps) {
  const { toast } = useToast();
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (asset.assetIcon && typeof asset.assetIcon !== 'string' && 'size' in asset.assetIcon) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      }
      reader.readAsDataURL(asset.assetIcon as File);
    } else {
        setIconPreview(null);
    }
  }, [asset.assetIcon]);


  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${fieldName} has been copied.`,
    });
  };

  const getStatusBadge = () => {
    switch (asset.status) {
      case 'active':
        return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending Review</Badge>;
      case 'frozen':
        return <Badge variant="destructive">Frozen</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  }
  
  const renderConditionalContent = () => {
    if (userRole === 'superadmin') {
      return <AssignedAgents assetId={asset.id} />;
    }

    if (view === 'workspace') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Asset Actions</CardTitle>
            <CardDescription>Perform actions on this asset. (Available after approval)</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" disabled={asset.status !== 'active'}>
              <Coins className="mr-2 h-4 w-4" />
              Mint Tokens
            </Button>
            <Button variant="outline" disabled={asset.status !== 'active'}>
              <Flame className="mr-2 h-4 w-4" />
              Burn Tokens
            </Button>
            <Button variant="outline" disabled={asset.status !== 'active'}>
              <Snowflake className="mr-2 h-4 w-4" />
              Freeze Address
            </Button>
          </CardContent>
        </Card>
      );
    }

    return null;
  }
  
  const assetTypeLabel = assetTypes.find(t => t.value === asset.assetType)?.label || asset.assetType;


  return (
    <div className="space-y-6">
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard title="Volume (24h)" value="$0.00" icon={TrendingUp} />
          <KpiCard title="Transactions (24h)" value="0" icon={BarChart} />
          <KpiCard title="Market Cap" value="$0.00" icon={CircleDollarSign} />
        </div>
      )}
       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Overview</CardTitle>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">Open for investments</Badge>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <OverviewRow label="Asset type" value={assetTypeLabel} />
            <OverviewRow label="Eligible Investors" value={asset.eligibleInvestors?.join(', ') || 'N/A'} />
            <OverviewRow label="Subscription Time" value={asset.subscriptionTime || 'N/A'} />
            <OverviewRow label="Min. Investment" value={asset.minInvestment ? `$${asset.minInvestment.toLocaleString('en-US')} USD` : 'N/A'} />
            <OverviewRow label="Max. Investment" value={asset.maxInvestment ? `$${asset.maxInvestment.toLocaleString('en-US')} USD` : 'Not set'} />
            <OverviewRow label="Order Fee" value={asset.subscriptionFees !== undefined ? `${asset.subscriptionFees}%` : 'N/A'} />
            <OverviewRow label="Redemption Time" value={asset.redemptionTime || 'N/A'} />
            <OverviewRow label="Min. Redemption Amount" value={asset.minRedemptionAmount ? `$${asset.minRedemptionAmount.toLocaleString('en-US')} USD` : 'N/A'} />
            <OverviewRow label="Redemption Fees" value={asset.redemptionFees !== undefined ? `${asset.redemptionFees}%` : 'N/A'} />
            <OverviewRow label="Available networks" value={<NetworkIcons networks={asset.network} />} />
        </CardContent>
    </Card>
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                 <Avatar className="h-12 w-12 text-xl font-bold">
                    {iconPreview ? (
                      <AvatarImage src={iconPreview} alt={asset.assetName} />
                    ) : (
                      <AvatarFallback>{asset.assetName.charAt(0)}</AvatarFallback>
                    )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{asset.assetName}</h2>
                  <p className="text-primary">{asset.assetTicker}</p>
                </div>
              </div>
              {getStatusBadge()}
            </div>

            <div className="space-y-4">
              <InfoRow 
                label="Asset ID" 
                value={asset.id} 
                onCopy={() => copyToClipboard(asset.id, 'Asset ID')}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                    <p className="text-muted-foreground">Decimals</p>
                    <p className="font-medium">{asset.decimals}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground">Is Freezable</p>
                    <p className="font-medium">{asset.isFreezable ? 'Yes' : 'No'}</p>
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
              <span className="font-medium">{asset.maxSupply.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Total Supply</span>
              <span className="font-medium">0 / {asset.maxSupply.toLocaleString()}</span>
            </div>
            <Progress value={0} />
             <div className="text-right text-sm text-muted-foreground">0%</div>
          </CardContent>
        </Card>
      </div>

      {renderConditionalContent()}
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
