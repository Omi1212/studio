'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Users,
  Settings,
  ShieldCheck,
  LifeBuoy,
  CircleDollarSign,
  Briefcase,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issue-token', label: 'Issue Token', icon: CircleDollarSign },
  { href: '/my-tokens', label: 'My Tokens', icon: Briefcase },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/users', label: 'Users', icon: Users },
];

const helpMenuItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/security', label: 'Security', icon: ShieldCheck },
  { href: '/help', label: 'Help', icon: LifeBuoy },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <h2 className="text-2xl font-bold text-primary font-headline">BlockStratus</h2>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          {helpMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
