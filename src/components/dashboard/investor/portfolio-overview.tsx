'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { investorsData } from '@/lib/data';
import { useMemo } from 'react';

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const chartData = [
  { date: '2024-07-01', value: 25000 },
  { date: '2024-07-05', value: 28510 },
  { date: '2024-07-10', value: 27900 },
  { date: '2024-07-15', value: 25880 },
  { date: '2024-07-20', value: 31180 },
  { date: '2024-07-25', value: 32750 },
  { date: '2024-07-30', value: 32750 },
];

export default function PortfolioOverview() {
  const investor = investorsData.find(inv => inv.id === 'inv-001');
  const totalValue = useMemo(() => {
    if (!investor) return 0;
    return investor.holdings.reduce((acc, holding) => acc + (holding.amount * holding.value), 0);
  }, [investor]);

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
