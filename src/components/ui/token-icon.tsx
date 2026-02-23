'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import type { AssetDetails } from '@/lib/types';

interface AssetIconProps extends React.HTMLAttributes<HTMLElement> {
    asset?: Partial<AssetDetails>;
}

export default function TokenIcon({ asset, className }: AssetIconProps) {
    if (!asset) {
        return (
            <Avatar className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
        );
    }
    const initial = (asset.assetTicker || asset.assetName || '?').charAt(0);

    return (
        <Avatar className={cn("flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground", className)}>
            <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
    );
}
