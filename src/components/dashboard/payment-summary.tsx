'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { paymentData } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expense: {
    label: 'Expense',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function PaymentSummary({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-headline">Payment Summary</CardTitle>
        <div className="flex items-baseline gap-4">
          <p className="text-3xl font-bold font-headline">$1,250,230.00</p>
          <span className="text-sm text-green-500">+15.2% from last month</span>
        </div>
        <CardDescription>Total balance from all accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={paymentData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{
                stroke: 'hsl(var(--border))',
                strokeWidth: 2,
                strokeDasharray: '3 3',
              }}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="income"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
