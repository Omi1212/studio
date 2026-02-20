
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function PortfolioValue() {
  const [totalValue, setTotalValue] = useState(0);
  const [assetCount, setAssetCount] = useState(0);

  useEffect(() => {
    fetch('/api/investors/inv-001')
      .then(res => res.json())
      .then(investor => {
        const value = investor?.holdings.reduce((acc: number, asset: any) => acc + asset.amount * asset.value, 0) || 0;
        setTotalValue(value);
        setAssetCount(investor?.holdings.length || 0);
      });
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
        <p className="text-3xl font-bold font-headline">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-muted-foreground">{assetCount} assets</p>
      </CardContent>
    </Card>
  );
}
