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
import { Button } from '@/components/ui/button';
import type { AssetDetails } from '@/lib/types';

const networkExplorerMap: { [key: string]: { name: string; url: string } } = {
  spark: { name: 'Spark', url: 'https://sparkscan.io' },
  liquid: { name: 'Liquid', url: 'https://mempool.space/liquid' },
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
              <TableHead className="text-right">Explorer</TableHead>
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

              return (
              <TableRow key={net}>
                  <TableCell>{networkExplorerMap[net]?.name || net}</TableCell>
                  <TableCell>{tokenStandard}</TableCell>
                  <TableCell className="font-mono">{tokenSupply.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{circulatingSupply.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{holders.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {explorer && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={explorer.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
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
