'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import type { AssetDetails } from '@/lib/types';

export default function PortfolioValue() {
  const [totalValue, setTotalValue] = useState(0);
  const [assetCount, setAssetCount] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const companyId = localStorage.getItem('selectedCompanyId');
    setSelectedCompanyId(companyId);
    const handleCompanyChange = () => {
        const companyId = localStorage.getItem('selectedCompanyId');
        setSelectedCompanyId(companyId);
    };
    window.addEventListener('companyChanged', handleCompanyChange);
    return () => window.removeEventListener('companyChanged', handleCompanyChange);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/investors/inv-001').then(res => res.json()),
      fetch('/api/assets?perPage=999').then(res => res.json())
    ]).then(([investor, assetsData]) => {
      const allAssets: AssetDetails[] = assetsData.data || [];
      
      let holdings = investor?.holdings || [];

      if (selectedCompanyId) {
        const companyAssetIds = allAssets.filter(a => a.companyId === selectedCompanyId).map(a => a.id);
        holdings = holdings.filter((h: any) => companyAssetIds.includes(h.assetId));
      }
      
      const value = holdings.reduce((acc: number, asset: any) => acc + asset.amount * asset.value, 0) || 0;
      setTotalValue(value);
      setAssetCount(holdings.length || 0);
    });
  }, [selectedCompanyId]);

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
