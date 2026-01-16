'use client';

import { Card, CardContent } from '@/components/ui/card';
import { investorsData } from '@/lib/data';

export default function PortfolioValue() {
  const investor = investorsData.find(inv => inv.id === 'inv-001');
  const totalValue = investor?.holdings.reduce((acc, token) => acc + token.amount * token.value, 0) || 0;

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
        <p className="text-3xl font-bold font-headline">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-muted-foreground">{investor?.holdings.length || 0} tokens</p>
      </CardContent>
    </Card>
  );
}
