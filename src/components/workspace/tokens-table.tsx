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
import Image from 'next/image';

const networkExplorerMap: { [key: string]: { name: string; url: string; addressPath?: string; } } = {
  spark: { name: 'Spark', url: 'https://sparkscan.io', addressPath: '/token/' },
  liquid: { name: 'Liquid', url: 'https://mempool.space/liquid', addressPath: '/address/' },
  rgb: { name: 'RGB', url: 'https://rgb.tech' },
  taproot: { name: 'Taproot Assets', url: 'https://mempool.space' },
};

const networkIconMap: { [key: string]: React.ReactNode } = {
    spark: <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>,
    liquid: <Image src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" width={24} height={24} />,
    rgb: <Image src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" width={24} height={24} />,
    taproot: <Image src="https://docs.lightning.engineering/~gitbook/image?url=https%3A%2F%2F2545062540-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MIzyiDsFtJBYVyhr1nT%252Favatar-1602260100761.png%3Fgeneration%3D1602260100982225%26alt%3Dmedia&width=32&dpr=2&quality=100&sign=15d20b51&sv=2" alt="Taproot Assets Logo" width={24} height={24} />,
};

export default function TokensTable({ asset }: { asset: AssetDetails }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">NAV</p>
                <p className="text-2xl font-bold font-headline">4,613,575 USD</p>
            </div>
            <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="text-2xl font-bold font-headline">400,000 USD</p>
            </div>
            <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Redemptions</p>
                <p className="text-2xl font-bold font-headline">261,198.33 USD</p>
            </div>
        </CardContent>
      </Card>
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
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {networkIconMap[net] || null}
                            <span>{networkExplorerMap[net]?.name || net}</span>
                        </div>
                    </TableCell>
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
    </div>
  );
}
