'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const PaymentSummary = dynamic(
  () => import('@/components/dashboard/payment-summary'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

export default function PaymentSummaryDynamic({ className }: { className?: string }) {
  return <PaymentSummary className={className} />;
}
