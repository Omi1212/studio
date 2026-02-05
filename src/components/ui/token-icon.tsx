
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import type { TokenDetails } from '@/lib/types';

type WorkspaceToken = Partial<TokenDetails> & { tokenName: string; tokenTicker: string };

interface TokenIconProps extends React.HTMLAttributes<HTMLElement> {
    token: WorkspaceToken;
}

export default function TokenIcon({ token, className }: TokenIconProps) {
    const initial = token.tokenTicker ? token.tokenTicker.charAt(0) : token.tokenName.charAt(0);

    return (
        <Avatar className={cn("flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground", className)}>
            <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
    );
}
