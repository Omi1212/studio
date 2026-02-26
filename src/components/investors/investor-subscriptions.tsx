'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SubscriptionStatus, AssetDetails, User } from '@/lib/types';
import AssetIcon from '../ui/asset-icon';
import { Badge } from '../ui/badge';
import Image from 'next/image';

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
};

const networkIconMap: { [key: string]: React.ReactNode } = {
    spark: <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>,
    liquid: <Image src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" width={24} height={24} />,
    rgb: <Image src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" width={24} height={24} />,
    taproot: <Image src="https://docs.lightning.engineering/~gitbook/image?url=https%3A%2F%2F2545062540-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MIzyiDsFtJBYVyhr1nT%252Favatar-1602260100761.png%3Fgeneration%3D1602260100982225%26alt%3Dmedia&width=32&dpr=2&quality=100&sign=15d20b51&sv=2" alt="Taproot Assets Logo" width={24} height={24} />,
};

type Subscription = {
  asset: AssetDetails;
  status: SubscriptionStatus;
};

function getStatusBadge(status: SubscriptionStatus) {
  switch (status) {
    case 'approved':
      return <Badge variant="outline" className="text-green-400 border-green-400">Approved</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Not Subscribed</Badge>;
  }
}

export default function InvestorSubscriptions({ investor }: { investor: User }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`/api/investors/${investor.id}/subscriptions`).then(res => res.json()),
            fetch(`/api/assets?perPage=999`).then(res => res.json())
        ]).then(([subsData, assetsData]) => {
            const subs: Subscription[] = [];
            const allAssets: AssetDetails[] = assetsData.data || [];
            
            for (const assetId in subsData) {
                const asset = allAssets.find(a => a.id === assetId);
                if (asset) {
                    subs.push({ asset, status: subsData[assetId] });
                }
            }
            setSubscriptions(subs);
        }).catch(console.error)
        .finally(() => setLoading(false));

    }, [investor.id]);

    if (loading) {
        return <p className="text-center text-muted-foreground py-8">Loading subscriptions...</p>;
    }
    
    if (subscriptions.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                This investor has no subscriptions.
            </div>
        );
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subscriptions.map(({ asset, status }) => {
                    const networks = Array.isArray(asset.network) ? asset.network : [asset.network].filter(Boolean);
                    return (
                        <TableRow key={asset.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <AssetIcon asset={asset} className="h-8 w-8" />
                                    <div>
                                        <p className="font-medium">{asset.assetName}</p>
                                        <p className="text-sm text-primary">{asset.assetTicker}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {networks.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 flex items-center justify-center" title={networkMap[networks[0]] || networks[0]}>
                                            {networkIconMap[networks[0]] || null}
                                        </div>
                                        <span>{networkMap[networks[0]] || networks[0]}</span>
                                    </div>
                                ) : (
                                    'N/A'
                                )}
                            </TableCell>
                            <TableCell className="font-mono">{investor.walletAddress.slice(0, 7)}...{investor.walletAddress.slice(-4)}</TableCell>
                            <TableCell className="text-right">{getStatusBadge(status)}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
