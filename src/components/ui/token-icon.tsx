
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import { exampleTokens } from '@/lib/data';
import type { TokenDetails } from '@/app/issue-token/page';

type WorkspaceToken = TokenDetails | (typeof exampleTokens)[0];

interface TokenIconProps extends React.HTMLAttributes<HTMLElement> {
    token: WorkspaceToken;
}

export default function TokenIcon({ token, className }: TokenIconProps) {
    const initial = token.tokenTicker ? token.tokenTicker.charAt(0) : token.tokenName.charAt(0);

    return (
        <Avatar className={cn("flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground", className)}>
            <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
    );
}
