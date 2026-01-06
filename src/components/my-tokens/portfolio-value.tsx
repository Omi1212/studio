'use client';

import { Card, CardContent } from '@/components/ui/card';
import { tokenData } from '@/lib/data';

export default function PortfolioValue() {
  const totalValue = tokenData.reduce((acc, token) => acc + token.balance * token.price, 0);

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
        <p className="text-3xl font-bold font-headline">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-muted-foreground">{tokenData.length} tokens</p>
      </CardContent>
    </Card>
  );
}
