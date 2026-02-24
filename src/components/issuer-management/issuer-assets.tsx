'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AssetDetails, Issuer, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import AssetIcon from '../ui/asset-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Rocket } from 'lucide-react';

function getStatusBadge(status: AssetDetails['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'frozen':
      return <Badge variant="destructive">Frozen</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

function AssetCard({ asset }: { asset: AssetDetails }) {
  const router = useRouter();
  
  const handleView = () => {
    if (asset.status === 'draft') {
        router.push(`/issue-asset/new?draft_id=${asset.id}`);
    } else {
        localStorage.setItem('selectedAssetId', asset.id);
        window.dispatchEvent(new Event('assetChanged'));
        router.push(`/workspace/${asset.id}`);
    }
  };

  const networks = Array.isArray(asset.network) ? asset.network : [asset.network].filter(Boolean);
  const displayNetwork = networks.length > 0 ? networkMap[networks[0]] || networks[0] : 'N/A';
  const remainingCount = networks.length - 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <AssetIcon asset={asset} className="h-10 w-10" />
          <div>
            <CardTitle className="text-lg">{asset.assetName}</CardTitle>
            <CardDescription className="text-primary font-bold">{asset.assetTicker}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            {getStatusBadge(asset.status)}
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{displayNetwork}</span>
              {remainingCount > 0 && <Badge variant="secondary">+{remainingCount}</Badge>}
            </div>
        </div>
         <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Max Supply</span>
            <span className="font-medium font-mono">{asset.maxSupply ? asset.maxSupply.toLocaleString() : '--'}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleView}>
          {asset.status === 'draft' ? 'Continue' : 'View'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function IssuerAssets({ issuer }: { issuer: Issuer }) {
  const [issuerAssets, setIssuerAssets] = useState<AssetDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!issuer) {
        setLoading(false);
        return;
    };
    
    setLoading(true);

    fetch(`/api/users?query=${issuer.email}`)
      .then(res => res.json())
      .then(usersResponse => {
        const user: User = usersResponse.data[0];
        if (user && user.companyId && user.companyId.length > 0) {
          const companyIdsQuery = user.companyId.map(id => `companyId=${id}`).join('&');
          // The API doesn't support multiple IDs, so we fetch all and filter client-side
          fetch(`/api/assets?perPage=999`)
            .then(res => res.json())
            .then(assetsResponse => {
              const allAssets = assetsResponse.data || [];
              const companyAssets = allAssets.filter((asset: AssetDetails) => user.companyId!.includes(asset.companyId || ''));
              setIssuerAssets(companyAssets);
            });
        } else {
          setIssuerAssets([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [issuer]);

  if (loading) {
    return (
        <Card className="h-64 animate-pulse bg-muted/50"></Card>
    );
  }
  
  return (
    <div>
        <h2 className="text-xl font-semibold mb-4">Issued Assets</h2>
        {issuerAssets.length === 0 ? (
            <div className="border-dashed border-2 border-muted-foreground/50 rounded-lg h-48 flex flex-col items-center justify-center text-center p-4">
                <Rocket className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assets Issued</h3>
                <p className="text-muted-foreground">This issuer has not launched any assets yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issuerAssets.map(asset => (
                    <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
        )}
    </div>
  );
}
