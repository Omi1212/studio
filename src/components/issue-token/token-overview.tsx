'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import type { AssetDetails } from '@/lib/types';
import AssetDetailsView from '../workspace/token-details-view';
import { Button } from '../ui/button';
import Link from 'next/link';

interface AssetOverviewProps {
  asset: AssetDetails;
}

export default function TokenOverview({ asset }: AssetOverviewProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Request Submitted Successfully!</AlertTitle>
        <AlertDescription>
          Your asset is now pending review. You can monitor its status from your
          workspace.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button asChild className="w-full">
            <Link href="/issue-asset">Back to Launchpad</Link>
        </Button>
         <Button asChild variant="outline" className="w-full">
            <Link href="/issue-asset/new">Create Another Asset</Link>
        </Button>
      </div>
      
      <AssetDetailsView asset={asset} view="workspace" />
    </div>
  );
}
