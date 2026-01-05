import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { volumeData } from '@/lib/data';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function VolumeCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {volumeData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.change > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownLeft className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{item.value}</div>
            <p
              className={`text-xs ${
                item.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.change > 0 ? '+' : ''}
              {item.change.toFixed(1)}% from yesterday
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
