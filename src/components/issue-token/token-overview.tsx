
'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import type { TokenDetails } from '@/lib/types';
import TokenDetailsView from '../workspace/token-details-view';
import { Button } from '../ui/button';
import Link from 'next/link';

interface TokenOverviewProps {
  token: TokenDetails;
}

export default function TokenOverview({ token }: TokenOverviewProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Request Submitted Successfully!</AlertTitle>
        <AlertDescription>
          Your token is now pending review. You can monitor its status from your
          workspace.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button asChild className="w-full">
            <Link href="/issue-token">Back to Launchpad</Link>
        </Button>
         <Button asChild variant="outline" className="w-full">
            <Link href="/issue-token/new">Create Another Token</Link>
        </Button>
      </div>
      
      <TokenDetailsView token={token} view="workspace" />
    </div>
  );
}
