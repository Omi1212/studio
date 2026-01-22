
'use client';

import {
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/lib/types';


export default function NavUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isWalletConnected');
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-auto rounded-full px-2">
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{user ? getInitials(user.name) : '...'}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
           <DropdownMenuLabel>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground font-normal">
                    {user.email}
                </p>
            </DropdownMenuLabel>
        ) : (
             <DropdownMenuLabel>
                <p className="font-medium">Loading...</p>
            </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
