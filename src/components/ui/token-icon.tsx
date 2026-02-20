
'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import type { AssetDetails } from '@/lib/types';

interface TokenIconProps extends React.HTMLAttributes<HTMLElement> {
    token?: Partial<AssetDetails>;
}

export default function TokenIcon({ token, className }: TokenIconProps) {
    if (!token) {
        return (
            <Avatar className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
        );
    }

    const initial = (token.assetTicker || token.assetName || '?').charAt(0);

    return (
        <Avatar className={cn("flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground", className)}>
            <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
    );
}
