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
import { Copy, Globe, Coins, Flame, Snowflake, TrendingUp, BarChart, CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AssetDetails, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { useState, useEffect } from 'react';
import AssignedAgents from './assigned-agents';

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


export default function AssetDetailsView({
  asset,
  view = 'workspace',
  userRole,
}: AssetDetailsViewProps) {
  const { toast } = useToast();
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const networkExplorerMap: { [key: string]: { name: string; url: string } } = {
    spark: { name: 'Sparkscan', url: 'https://sparkscan.io' },
    liquid: { name: 'Liquid Explorer', url: 'https://mempool.space/liquid' },
    rgb: { name: 'RGB Explorer', url: 'https://rgb.tech' },
    taproot: { name: 'Taproot Explorer', url: 'https://mempool.space' },
  };

  const explorer = (asset && networkExplorerMap[asset.network]) || { name: 'Explorer', url: '#'};


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

    if (view === 'dashboard' || view === 'workspace') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Asset Actions</CardTitle>
            <CardDescription>Perform actions on this asset. (Available after approval)</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" disabled={asset.status !== 'active'}>
              <Coins className="mr-2 h-4 w-4" />
              Mint Assets
            </Button>
            <Button variant="outline" disabled={asset.status !== 'active'}>
              <Flame className="mr-2 h-4 w-4" />
              Burn Assets
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


  return (
    <div className="space-y-6">
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard title="Volume (24h)" value="$0.00" icon={TrendingUp} />
          <KpiCard title="Transactions (24h)" value="0" icon={BarChart} />
          <KpiCard title="Market Cap" value="$0.00" icon={CircleDollarSign} />
        </div>
      )}
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
                label="Asset Public Key" 
                value={asset.publicKey} 
                onCopy={() => copyToClipboard(asset.publicKey, 'Asset Public Key')} 
              />
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
          <CardFooter>
             <Button variant="outline" className="w-full" asChild>
              <a href={explorer.url} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                View on {explorer.name}
              </a>
            </Button>
          </CardFooter>
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
