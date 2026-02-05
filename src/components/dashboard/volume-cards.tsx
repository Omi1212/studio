'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type VolumeItem = {
    title: string;
    value: string;
    change: number;
};

export default function VolumeCards() {
    const [volumeData, setVolumeData] = useState<VolumeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/volume')
            .then(res => res.json())
            .then(data => setVolumeData(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-28" />
                ))}
            </div>
        );
    }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
