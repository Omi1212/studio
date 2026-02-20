'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AssetsList = dynamic(
  () => import('@/components/my-tokens/tokens-list'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[200px] w-full" />,
  }
);

export default function AssetsListDynamic() {
  return <AssetsList />;
}
