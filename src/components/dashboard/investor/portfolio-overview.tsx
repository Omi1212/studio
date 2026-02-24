'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo, useState, useEffect } from 'react';
import type { AssetDetails } from '@/lib/types';

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function PortfolioOverview({ selectedCompanyId }: { selectedCompanyId: string | null }) {
  const [totalValue, setTotalValue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/investors/inv-001').then(res => res.json()),
      fetch('/api/portfolio-history').then(res => res.json()),
      fetch('/api/assets?perPage=999').then(res => res.json())
    ]).then(([investorData, historyData, assetsData]) => {
      const allAssets: AssetDetails[] = assetsData.data || [];
      let holdings = investorData?.holdings || [];

      if (selectedCompanyId) {
          const companyAssetIds = allAssets.filter(a => a.companyId === selectedCompanyId).map(a => a.id);
          holdings = holdings.filter((h: any) => companyAssetIds.includes(h.assetId));
      }
      
      const value = holdings.reduce((acc: number, holding: any) => acc + (holding.amount * holding.value), 0) || 0;
      setTotalValue(value);
      setChartData(historyData.data);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, [selectedCompanyId]);

  if(loading) {
      return <Card className="h-[350px] animate-pulse bg-muted/50"></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Portfolio Value</CardDescription>
        <div className="flex items-baseline gap-2">
            <CardTitle className="text-4xl font-bold font-headline">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
            <span className="text-sm text-green-500 font-medium">+2.1% from last month</span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            indicator="dot"
                            labelFormatter={(label, payload) => {
                                return new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                            }}
                            formatter={(value) => `$${(value as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        />}
                    />
                    <Line
                        dataKey="value"
                        type="monotone"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
