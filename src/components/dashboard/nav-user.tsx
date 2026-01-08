
'use client';

import {
  ChevronDown,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '../ui/sidebar';

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

export default function NavUser() {
  const router = useRouter();
  const { state } = useSidebar();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group flex w-full items-center justify-between gap-3 p-2 text-left focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt={userAvatar.description}
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:w-0">
              <p className="text-sm font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground">John Doe</p>
              <p className="text-xs text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground/80">
                john.doe@example.com
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/70 transition-all duration-200 group-hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" side="top">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
