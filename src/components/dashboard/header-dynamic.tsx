'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const Header = dynamic(
  () => import('@/components/dashboard/header'),
  {
    ssr: false,
    loading: () => <Skeleton className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6" />,
  }
);

export default function HeaderDynamic() {
  return <Header />;
}
