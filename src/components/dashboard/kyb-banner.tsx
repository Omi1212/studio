'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function KybBanner() {
    return (
        <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-300 [&>svg]:text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className='flex-1'>
                    <AlertTitle className="font-bold text-yellow-200">Complete Your Business Verification</AlertTitle>
                    <AlertDescription>
                        Finish your KYB (Know Your Business) verification and link your identity providers to access all platform features.
                    </AlertDescription>
                </div>
                 <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <Button variant="outline" asChild className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/20 hover:text-yellow-200">
                        <Link href="/settings/compliance">Link Providers</Link>
                    </Button>
                    <Button asChild className="bg-yellow-400 text-yellow-950 hover:bg-yellow-300">
                        <Link href="/profile">Complete KYB</Link>
                    </Button>
                </div>
            </div>
        </Alert>
    )
}
