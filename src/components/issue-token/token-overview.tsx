
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Info, Globe, Coins, Flame, Snowflake, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TokenDetails } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useState, useEffect } from 'react';
import TokenDetailsView from '../workspace/token-details-view';

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
          Your token is now pending review. You can monitor its status from your workspace.
        </AlertDescription>
      </Alert>
      <TokenDetailsView token={token} />
    </div>
  );
}
