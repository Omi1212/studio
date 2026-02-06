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
import { CheckCircle2, ShieldCheck, User as UserIcon, Mail, Phone, Building, FileLock2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { countries } from '@/lib/countries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const kycLevels = [
  {
    level: 1,
    title: 'User Level 1',
    description: 'Email and phone number verified.',
    requirements: ['Verified Email', 'Verified Phone Number'],
  },
  {
    level: 2,
    title: 'User Level 2',
    description: 'Basic personal information provided.',
    requirements: ['Full Name', 'Date of Birth', 'Residential Address'],
  },
  {
    level: 3,
    title: 'User Level 3',
    description: 'Official ID document submitted.',
    requirements: ['Passport or National ID', 'Liveness Check'],
  },
  {
    level: 4,
    title: 'User Level 4',
    description: 'Proof of address verified.',
    requirements: ['Utility Bill or Bank Statement'],
  },
];

const kybLevels = [
  {
    level: 1,
    title: 'Business Level 1',
    description: 'Basic business information provided.',
    requirements: ['Business Name', 'Country of Operation'],
  },
  {
    level: 2,
    title: 'Business Level 2',
    description: 'Legal business documents submitted.',
    requirements: ['Certificate of Incorporation', 'Memorandum of Association'],
  },
  {
    level: 3,
    title: 'Business Level 3',
    description: 'Beneficial ownership information verified.',
    requirements: ['Details of major shareholders (over 25%)'],
  },
  {
    level: 4,
    title: 'Business Level 4',
    description: 'Financial information verified.',
    requirements: ['Business Bank Statements', 'Financial Reports'],
  },
];


function VerificationLevelIndicator({ currentLevel, levels }: { currentLevel: number, levels: typeof kycLevels }) {
  return (
    <div className="space-y-6">
      {levels.map((level) => {
        const isCompleted = currentLevel >= level.level;
        const isCurrent = currentLevel + 1 === level.level;

        return (
          <div key={level.level} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <div
                className={cn(
                    'flex-center h-8 w-8 rounded-full border-2',
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : isCurrent ? 'border-primary' : 'border-muted-foreground/30'
                )}
                >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <p className={cn(isCurrent ? 'text-primary font-bold' : 'text-muted-foreground')}>{level.level}</p>}
                </div>
                {level.level < levels.length && <div className={cn("w-0.5 flex-1", isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30')} />}
            </div>
            <div className="flex-1 -mt-1">
              <p className={cn("font-semibold", isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground')}>{level.title}</p>
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VerificationPrompt({ user, isBusiness }: { user: User, isBusiness: boolean }) {
    const levels = isBusiness ? kybLevels : kycLevels;
    const currentLevel = (isBusiness ? user.kybLevel : user.kycLevel) || 0;
    const nextLevel = levels.find(level => level.level === currentLevel + 1);

    if (nextLevel) {
        return (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6 text-center h-full">
            <h4 className="font-bold text-lg">Continue to {nextLevel.title}</h4>
            <p className="text-muted-foreground text-sm mt-2 mb-4">
            To unlock higher limits and more features, please complete the next verification step. You will need to provide:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mb-4 text-left">
                {nextLevel.requirements.map(req => <li key={req}>{req}</li>)}
            </ul>
            <Button>
            Start {nextLevel.title}
            </Button>
        </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6 text-center h-full">
        <ShieldCheck className="h-16 w-16 text-green-500 mb-4" />
        <h4 className="font-bold text-lg">You are fully verified!</h4>
        <p className="text-muted-foreground text-sm mt-2">
            You have successfully completed all identity verification steps.
        </p>
        </div>
    );
}

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
  const [selectedVerification, setSelectedVerification] = useState<'kyc' | 'kyb'>('kyc');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

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
  
  function getVerificationStatusText(status: 'verified' | 'pending' | 'rejected' | undefined) {
    if (!status) return 'Not Started';
    switch(status) {
        case 'verified': return 'Verified';
        case 'pending': return 'In Review';
        case 'rejected': return 'Rejected';
        default: return 'Not Started';
    }
  }

  function getKycStatusDescription(user: User) {
      const level = user.kycLevel || 0;
      if (level === 0 && user.kycStatus !== 'pending') return 'Identity verification not started.';
      if (user.kycStatus === 'pending') return `Your verification for Level ${level + 1} is currently under review.`;
      if (user.kycStatus === 'verified') {
          if (level >= kycLevels.length) return 'You have successfully completed all identity verification steps.';
          return `Level ${level} verified. You can now proceed to the next level of verification.`;
      }
      if (user.kycStatus === 'rejected') return `Your verification for Level ${level} was rejected. Please review the requirements and submit your documents again.`;
      return 'Identity verification not started.';
  }

  function getKybStatusDescription(user: User) {
      const level = user.kybLevel || 0;
      if (level === 0 && user.kybStatus !== 'pending') return 'Business verification not started.';
      if (user.kybStatus === 'pending') return `Your verification for Business Level ${level + 1} is currently under review.`;
      if (user.kybStatus === 'verified') {
          if (level >= kybLevels.length) return 'Your business has been fully verified.';
          return `Business Level ${level} verified. You can now proceed to the next level of verification.`;
      }
      if (user.kybStatus === 'rejected') return `Your verification for Business Level ${level} was rejected. Please review the requirements and submit your documents again.`;
      return 'Business verification not started.';
  }

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
                      <CardTitle>Verify my identity</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div
                              onClick={() => {
                                  setSelectedVerification('kyc');
                                  setIsVerificationModalOpen(true);
                              }}
                              className="rounded-lg border p-6 text-center cursor-pointer transition-all space-y-2 hover:bg-muted/50"
                          >
                              <FileLock2 className="mx-auto h-8 w-8 text-muted-foreground" />
                              <p className="font-semibold">KYC</p>
                              <p className={cn("text-sm", user.kycStatus === 'verified' ? 'text-green-500' : 'text-muted-foreground')}>{getVerificationStatusText(user.kycStatus)}</p>
                          </div>
                          
                          <div
                              onClick={() => {
                                  setSelectedVerification('kyb');
                                  setIsVerificationModalOpen(true);
                              }}
                              className="rounded-lg border p-6 text-center cursor-pointer transition-all space-y-2 hover:bg-muted/50"
                          >
                              <FileLock2 className="mx-auto h-8 w-8 text-muted-foreground" />
                              <p className="font-semibold">KYB</p>
                              <p className={cn("text-sm", user.kybStatus === 'verified' ? 'text-green-500' : 'text-muted-foreground')}>{getVerificationStatusText(user.kybStatus)}</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
       <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {selectedVerification === 'kyc' ? 'KYC Verification Status' : 'KYB Verification Status'}
                    </DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                    {selectedVerification === 'kyc' ? (
                        <div>
                            <h3 className="font-semibold">Status:</h3>
                            <p className="text-muted-foreground text-sm mb-6">{getKycStatusDescription(user)}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <VerificationLevelIndicator 
                                currentLevel={user.kycLevel || 0}
                                levels={kycLevels}
                                />
                                <VerificationPrompt user={user} isBusiness={false} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold">Status:</h3>
                            <p className="text-muted-foreground text-sm mb-6">{getKybStatusDescription(user)}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <VerificationLevelIndicator 
                                currentLevel={user.kybLevel || 0}
                                levels={kybLevels}
                                />
                                <VerificationPrompt user={user} isBusiness={true} />
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </SidebarProvider>
  );
}
