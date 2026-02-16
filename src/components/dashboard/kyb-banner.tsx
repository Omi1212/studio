'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function KybBanner() {
    return (
        <Alert className="bg-blue-500/10 border-blue-500/50 text-blue-300 [&>svg]:text-blue-400">
            <AlertTriangle className="h-4 w-4" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className='flex-1'>
                    <AlertTitle className="font-bold text-blue-200">Complete Your Business Verification</AlertTitle>
                    <AlertDescription>
                        Finish your KYB (Know Your Business) verification to access all platform features.
                    </AlertDescription>
                </div>
                 <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <Button variant="outline" asChild className="border-blue-400/50 text-blue-300 hover:bg-blue-400/20 hover:text-blue-200">
                        <Link href="/settings/general?open=kyb">Complete KYB</Link>
                    </Button>
                </div>
            </div>
        </Alert>
    )
}
