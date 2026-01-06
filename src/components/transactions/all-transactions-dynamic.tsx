'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AllTransactions = dynamic(
  () => import('@/components/transactions/all-transactions'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

export default function AllTransactionsDynamic({ className }: { className?: string }) {
  return <AllTransactions className={className} />;
}
