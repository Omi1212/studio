'use client';

import { useState, useEffect } from 'react';
import type { User, AssetDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AssetIcon from '../ui/asset-icon';
import { ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AgentAssetsProps {
    agent: User;
}

const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    ark: 'Arkade Assets',
    taproot: 'Taproot Assets',
};

export default function AgentAssets({ agent }: AgentAssetsProps) {
    const [assignedAssets, setAssignedAssets] = useState<AssetDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/assets?perPage=999').then(res => res.json()),
            fetch(`/api/agents/${agent.id}/assignments`).then(res => res.json())
        ]).then(([assetsResponse, agentAssetIds]) => {
            const allAssets = assetsResponse.data || [];
            const agentAssets = allAssets.filter((asset: AssetDetails) => agentAssetIds.includes(asset.id));
            setAssignedAssets(agentAssets);
        }).catch(console.error)
        .finally(() => setLoading(false));
    }, [agent.id]);

    if (loading) {
        return <Card className="h-64 animate-pulse bg-muted/50"></Card>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assigned Assets</CardTitle>
            </CardHeader>
            <CardContent>
                {assignedAssets.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead>Network</TableHead>
                                <TableHead className="text-right">Max Supply</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedAssets.map(asset => (
                                <TableRow key={asset.id} onClick={() => router.push(`/workspace/${asset.id}`)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <AssetIcon asset={asset} className="h-8 w-8" />
                                            <div>
                                                <p className="font-medium">{asset.assetName}</p>
                                                <p className="text-sm text-primary">{asset.assetTicker}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{(Array.isArray(asset.network) ? asset.network : [asset.network]).map(n => networkMap[n] || n).join(', ')}</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {asset.maxSupply ? asset.maxSupply.toLocaleString() : '--'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center">
                         <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-medium">No Assets Assigned</p>
                        <p className="text-sm">This agent has no assets assigned to them.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
