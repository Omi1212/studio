
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
  Building,
  ShoppingBag,
  ClipboardList,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import NavUser from './nav-user';

const allMenuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issue-token', label: 'Issue Token', icon: CircleDollarSign },
  { href: '/my-tokens', label: 'My Tokens', icon: Briefcase },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/issuer-management', label: 'Issuer Management', icon: Building, roles: ['superadmin'] },
  { href: '/user-management', label: 'User Management', icon: Users, roles: ['superadmin'] },
  { href: '/users', label: 'Users', icon: Users, roles: ['admin', 'investor', 'issuer'] },
];

const helpMenuItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/security', label: 'Security', icon: ShieldCheck },
  { href: '/help', label: 'Help', icon: LifeBuoy },
];

const superAdminMenu = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issuer-management', label: 'Issuer Management', icon: Building },
  { href: '/user-management', label: 'User Management', icon: Users },
];

const adminMenu = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/requests', label: 'Requests', icon: ClipboardList },
    { href: '/tokens', label: 'Tokens', icon: CircleDollarSign },
    { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
];

const investorMenu = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
    { href: '/my-tokens', label: 'Portfolio', icon: Briefcase },
];

const issuerMenu = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issue-token', label: 'Launchpad', icon: Briefcase },
  { href: '/investors', label: 'Investors', icon: Users },
  { href: '/whitelisting-requests', label: 'Whitelisting Requests', icon: ClipboardList },
  { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
];


export default function SidebarNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the code runs only on the client, preventing hydration errors.
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  let menuItems;

  if (!isClient) {
    // Render nothing or a skeleton loader on the server/initial client render.
    return null;
  }

  if (userRole === 'superadmin') {
    menuItems = superAdminMenu;
  } else if (userRole === 'investor') {
    menuItems = investorMenu;
  } else if (userRole === 'issuer') {
    menuItems = issuerMenu;
  } else if (userRole === 'admin') {
    menuItems = adminMenu;
  } else {
    menuItems = allMenuItems.filter(
      item => !item.roles || item.roles.includes(userRole || '')
    );
  }


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
      <SidebarFooter className="p-2 space-y-2">
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
        <NavUser />
      </SidebarFooter>
    </>
  );
}
