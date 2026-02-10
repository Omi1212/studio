'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User as UserIcon, Mail, Phone, Building, FileLock2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { countries } from '@/lib/countries';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) {
  return (
    <div className="flex items-center gap-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  )
}

function PersonalInfoRow({ label, value, actionLabel, onActionClick }: { label: string; value: React.ReactNode; actionLabel?: string; onActionClick?: () => void; }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2">
            <p className="text-sm text-muted-foreground mb-1 sm:mb-0">{label}</p>
            <div className="flex items-center gap-4">
                {actionLabel && (
                    <Button variant="link" className="text-sm p-0 h-auto text-primary hover:underline" onClick={onActionClick}>
                        {actionLabel}
                    </Button>
                )}
                <p className="text-sm font-medium text-right">{value}</p>
            </div>
        </div>
    );
}


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Fetch the most up-to-date user data from the API
        fetch(`/api/users?perPage=999`)
            .then(res => res.json())
            .then((allUsers: {data: User[]}) => {
                const apiUser = allUsers.data.find(u => u.id === parsedUser.id);
                // Merge localStorage data with API data, localStorage is source of truth for session-edits
                setUser(apiUser ? { ...apiUser, ...parsedUser } : parsedUser);
            })
            .catch(() => setUser(parsedUser)) // Fallback to localStorage user on API error
            .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, []);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  
  const verificationStatusMap = {
    verified: { text: "Verified", className: "text-green-400 border-green-400" },
    pending: { text: "Pending", className: "text-yellow-400 border-yellow-400" },
    rejected: { text: "Rejected", className: "text-red-500 border-red-500" },
  };

  if (loading) {
      return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Skeleton className="w-full max-w-4xl h-[600px]" />
        </div>
      )
  }

  if (!user) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p>No user data found. Please log in.</p>
      </div>
    );
  }

  const isBusinessRole = user.role === 'issuer' || user.role === 'agent' || user.role === 'superadmin';
  const currentVerificationStatus = isBusinessRole ? user.kybStatus : user.kycStatus;
  // @ts-ignore
  const currentStatusBadge = verificationStatusMap[currentVerificationStatus || 'pending'];


  const maskEmail = (email: string) => {
      if (!email) return '';
      const [local, domain] = email.split('@');
      if (local.length > 3) {
          return `${local.substring(0, 2)}***@${domain}`;
      }
      return email;
  }
  
  const countryObj = countries.find(c => c.value === user.country || c.label === user.country);
  const countryDisplay = countryObj ? countryObj.label : user.country;

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-headline font-semibold">
                    My Profile
                </h1>
            </div>
            
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 text-4xl">
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl pt-2">{isBusinessRole ? user.businessName || user.name : user.name}</CardTitle>
                        <CardDescription>{isBusinessRole ? `Business Level ${user.kybLevel || 0}` : `User Level ${user.kycLevel || 0}`}</CardDescription>
                        <Badge variant="outline" className={currentStatusBadge.className}>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            {isBusinessRole ? 'KYB' : 'KYC'} Status: {currentStatusBadge.text}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={UserIcon} label="Username" value={user.name.toLowerCase().replace(/\s+/g, '')} />
                        <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                         {isBusinessRole && user.businessName && <InfoRow icon={Building} label="Business Name" value={user.businessName} />}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-7">
                    <CardHeader>
                        <CardTitle>{isBusinessRole ? 'Business Information' : 'Personal Information'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <PersonalInfoRow label="Country of Residence" value={countryDisplay || 'Not set'} actionLabel="Change" />
                        <PersonalInfoRow label="City" value={user.city || 'Not set'} />
                        <PersonalInfoRow label="Legal Name" value={user.legalName || 'Not set'} />
                        <PersonalInfoRow label="Date of Birth" value={user.dob || 'Not set'} />
                        {!isBusinessRole && <PersonalInfoRow label="Identification Documents" value={user.idDoc || 'Not set'} />}
                        <PersonalInfoRow label="Address" value={user.address || 'Not set'} />
                        <PersonalInfoRow label="Email Address" value={maskEmail(user.email)} />
                        <PersonalInfoRow label="Password" value="******" actionLabel="Change" />
                    </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                    <CardDescription>Manage your language, currency, and theme settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label>Theme</Label>
                        <Tabs defaultValue="dark" className="w-auto">
                            <TabsList>
                                <TabsTrigger value="light">Light</TabsTrigger>
                                <TabsTrigger value="dark">Dark</TabsTrigger>
                                <TabsTrigger value="system">System</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger id="language">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Español</SelectItem>
                                    <SelectItem value="fr">Français</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue="usd">
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                                    <SelectItem value="eur">EUR - Euro</SelectItem>
                                    <SelectItem value="btc">BTC - Bitcoin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
