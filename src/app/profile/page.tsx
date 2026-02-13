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
import { ShieldCheck, User as UserIcon, Phone, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { countries } from '@/lib/countries';
import IdentityVerification from '@/components/profile/identity-verification';

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
                <div className="text-sm font-medium text-right break-all">{value}</div>
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

        const applyDefaultData = (user: User): User => {
            let finalUser = { ...user };

            // Default personal data, applied if missing
            const personalDefaults = {
                country: 'El Salvador',
                city: 'San Salvador',
                legalName: user.name,
                dob: '1990-01-01',
                idDoc: 'DUI: 01234567-8',
                address: '123 Calle Principal, San Salvador',
                phone: '+503 7890-1234'
            };

            Object.keys(personalDefaults).forEach(key => {
                const k = key as keyof typeof personalDefaults;
                if (!finalUser[k]) {
                    finalUser[k] = personalDefaults[k];
                }
            });

            // Business defaults for issuer/agent/superadmin
            if (user.role === 'issuer' || user.role === 'agent' || user.role === 'superadmin') {
                if (!finalUser.businessName) {
                    finalUser.businessName = finalUser.name; // Default business name to user's name
                }
            }

            return finalUser;
        };
        
        fetch(`/api/users?perPage=999`)
            .then(res => res.json())
            .then((allUsers: {data: User[]}) => {
                const apiUser = allUsers.data.find(u => u.id === parsedUser.id);
                const finalUser: User = apiUser ? { ...apiUser, ...parsedUser } : parsedUser;
                setUser(applyDefaultData(finalUser));
            })
            .catch(() => {
                setUser(applyDefaultData(parsedUser));
            })
            .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '';
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
                        <CardTitle className="text-2xl pt-2">{user.name}</CardTitle>
                        <CardDescription>{isBusinessRole ? `Business Level ${user.kybLevel || 0}` : `User Level ${user.kycLevel || 0}`}</CardDescription>
                        <Badge variant="outline" className={currentStatusBadge.className}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            {isBusinessRole ? 'KYB' : 'KYC'} Status: {currentStatusBadge.text}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={UserIcon} label="Username" value={user.name.toLowerCase().replace(/\s+/g, '')} />
                        <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-7">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <PersonalInfoRow label="Country of Residence" value={countryDisplay || 'Not set'} actionLabel="Change" />
                        <PersonalInfoRow label="City" value={user.city || 'Not set'} />
                        <PersonalInfoRow label="Legal Name" value={user.legalName || 'Not set'} />
                        <PersonalInfoRow label="Date of Birth" value={user.dob || 'Not set'} />
                        <PersonalInfoRow label="Identification Documents" value={user.idDoc || 'Not set'} />
                        <PersonalInfoRow label="Address" value={user.address || 'Not set'} />
                        <PersonalInfoRow label="Email Address" value={maskEmail(user.email)} />
                    </CardContent>
                </Card>
              </div>

               {isBusinessRole && (
                <Card>
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <PersonalInfoRow label="Business Name" value={user.businessName || 'Not set'} />
                        <PersonalInfoRow label="Business Legal Name" value={'Emisores de Activos Digitales, S.A. de C.V.'} />
                        <PersonalInfoRow label="Business Registration ID" value={'NRC: 12345-6'} />
                        <PersonalInfoRow label="Business Address" value={'Colonia San Benito, San Salvador'} />
                    </CardContent>
                </Card>
              )}
              
              {user.role === 'investor' && <IdentityVerification kycLevel={user.kycLevel || 0} />}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
