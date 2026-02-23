'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AssetDetails } from '@/lib/types';

const networkExplorerMap: { [key: string]: { name: string; url: string; addressPath?: string; } } = {
  spark: { name: 'Spark', url: 'https://sparkscan.io', addressPath: '/address/' },
  liquid: { name: 'Liquid', url: 'https://mempool.space/liquid', addressPath: '/address/' },
  rgb: { name: 'RGB', url: 'https://rgb.tech' },
  taproot: { name: 'Taproot Assets', url: 'https://mempool.space' },
};

export default function TokensTable({ asset }: { asset: AssetDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Network</TableHead>
              <TableHead>Token Standard</TableHead>
              <TableHead>Token Supply</TableHead>
              <TableHead>Circulating Supply</TableHead>
              <TableHead>Holders</TableHead>
              <TableHead className="text-right">Contract</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(asset.network || []).map((net) => {
              const tokenStandardMap: { [key: string]: string } = {
                  spark: 'SPK-20',
                  liquid: 'L-ASSET',
                  rgb: 'RGB-20',
                  taproot: 'TAP',
              };
              const tokenStandard = tokenStandardMap[net] || 'Unknown';

              const tokenSupply = Math.floor(asset.maxSupply / (asset.network.length || 1));
              const circulatingSupply = Math.floor(tokenSupply * 0.85); // Mock 85% circulating
              const holders = (parseInt(asset.id.replace(/\D/g, '').slice(-4) || '100', 10)) * (asset.network.length > 1 ? 2 : 1) + 150 + Math.floor(Math.random() * 50);
              
              const explorer = networkExplorerMap[net];
              const contractAddress = asset.destinationAddress || "N/A";
              const explorerUrl = (explorer && explorer.addressPath) ? `${explorer.url}${explorer.addressPath}${contractAddress}` : explorer?.url || '#';

              return (
              <TableRow key={net}>
                  <TableCell>{networkExplorerMap[net]?.name || net}</TableCell>
                  <TableCell>{tokenStandard}</TableCell>
                  <TableCell className="font-mono">{tokenSupply.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{circulatingSupply.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{holders.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {contractAddress !== "N/A" ? (
                      <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-primary hover:underline">
                        {`${contractAddress.substring(0, 7)}...${contractAddress.substring(contractAddress.length - 4)}`}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
              </TableRow>
              )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
