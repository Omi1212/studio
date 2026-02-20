
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import type { AssetDetails } from '@/lib/types';

type WorkspaceAsset = Partial<AssetDetails> & { assetName: string; assetTicker: string };

interface AssetIconProps extends React.HTMLAttributes<HTMLElement> {
    asset: WorkspaceAsset;
}

export default function AssetIcon({ asset, className }: AssetIconProps) {
    const initial = asset.assetTicker ? asset.assetTicker.charAt(0) : asset.assetName.charAt(0);

    return (
        <Avatar className={cn("flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground", className)}>
            <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
    );
}
