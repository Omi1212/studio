'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function KycBanner() {
    return (
        <Alert variant="primary">
            <AlertTriangle className="h-4 w-4" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className='flex-1'>
                    <AlertTitle>Complete Your Identity Verification</AlertTitle>
                    <AlertDescription>
                        Finish your KYC (Know Your Customer) verification to access all platform features.
                    </AlertDescription>
                </div>
                 <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <Button variant="outline" asChild className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20">
                        <Link href="/profile">Complete KYC</Link>
                    </Button>
                </div>
            </div>
        </Alert>
    )
}
