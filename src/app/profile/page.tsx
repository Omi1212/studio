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
import { ShieldCheck, User as UserIcon, Phone, Building, Settings, Edit, KeyRound, Shield, Monitor, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { countries } from '@/lib/countries';
import IdentityVerification from '@/components/profile/identity-verification';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTheme } from 'next-themes';


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

// --- Copied from identity-verification.tsx ---
interface VerificationStepProps {
  level: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

function VerificationStep({ level, title, description, isCompleted, isCurrent }: VerificationStepProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'border-2 border-primary text-primary' : 'bg-muted text-muted-foreground'}`}>
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className={isCurrent ? 'font-bold':''}>{level}</span>}
        </div>
      </div>
      <div className="pt-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function VerificationCallToAction({ kycLevel }: { kycLevel: number }) {
  const levelsInfo = [
    // kycLevel 0
    { 
      title: "Continue to User Level 1", 
      description: "To get started, please verify your email and phone number.", 
      requirements: [], 
      buttonText: "Verify Identity" 
    },
    // kycLevel 1
    { 
      title: "Continue to User Level 2", 
      description: "Provide your basic personal information to increase your account limits.", 
      requirements: ["Full Name", "Date of Birth", "Country of Residence"], 
      buttonText: "Verify Identity" 
    },
    // kycLevel 2
    { 
      title: "Continue to User Level 3", 
      description: "To unlock higher limits and more features, please complete the next verification step.\n\nYou will need to provide:", 
      requirements: ["Passport or National ID", "Liveness Check"], 
      buttonText: "Verify Identity" 
    },
    // kycLevel 3
    { 
      title: "Continue to User Level 4", 
      description: "Submit a proof of address to complete your verification and unlock all platform features.", 
      requirements: ["Utility bill or Bank statement"], 
      buttonText: "Verify Identity" 
    },
  ];

  if (kycLevel >= 4) {
    return (
      <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
        <h4 className="font-semibold text-lg">Fully Verified</h4>
        <p className="text-sm text-muted-foreground mt-1">You have completed all verification steps.</p>
      </div>
    );
  }

  const nextStepInfo = levelsInfo[kycLevel];

  return (
    <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg p-6 h-full flex flex-col text-center">
      <h4 className="font-semibold text-lg">{nextStepInfo.title}</h4>
      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line flex-1">{nextStepInfo.description}</p>
      {nextStepInfo.requirements.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 my-4 max-w-max mx-auto text-left">
          {nextStepInfo.requirements.map(req => <li key={req}>{req}</li>)}
        </ul>
      )}
      <Button className="w-full mt-auto">{nextStepInfo.buttonText}</Button>
    </div>
  );
}

const kycSteps = [
    { level: 1, title: "User Level 1", description: "Email and phone number verified." },
    { level: 2, title: "User Level 2", description: "Basic personal information provided." },
    { level: 3, title: "User Level 3", description: "Official ID document submitted." },
    { level: 4, title: "User Level 4", description: "Proof of address verified." },
];
// --- End Copy ---


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);

        fetch(`/api/users/${parsedUser.id}`)
            .then(res => {
                if (res.ok) return res.json();
                // If fetching fails, use the stored user as a fallback.
                return parsedUser;
            })
            .then((apiUser: User) => {
                // Merge localStorage data over API data to preserve any unsaved changes during session
                const mergedUser = { ...parsedUser, ...apiUser };
                setUser(mergedUser);
            })
            .catch(() => {
                // On error, still use the stored user
                setUser(parsedUser);
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
            <Skeleton className="w-full max-w-6xl h-[600px]" />
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
  const currentVerificationStatus = user.kycStatus;
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
                        <CardDescription>User Level {user.kycLevel || 0}</CardDescription>
                        <div className="pt-1">
                            <Badge variant="outline" className={currentStatusBadge.className}>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                KYC Status: {currentStatusBadge.text}
                            </Badge>
                        </div>
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
              
              {isBusinessRole ? (
                <Accordion type="single" collapsible className="w-full space-y-6">
                    <AccordionItem value="user-preferences">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Settings className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">User Preferences</h3>
                                        <p className="text-sm text-muted-foreground">Manage your language, currency, and theme settings.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label>Theme</Label>
                                        <Tabs value={theme} onValueChange={setTheme} className="w-auto">
                                            <TabsList className="h-auto">
                                                <TabsTrigger value="light" className="px-6 py-2">Light</TabsTrigger>
                                                <TabsTrigger value="dark" className="px-6 py-2">Dark</TabsTrigger>
                                                <TabsTrigger value="system" className="px-6 py-2">System</TabsTrigger>
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
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="kyc-verification">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Identity Verification (KYC)</h3>
                                        <p className="text-sm text-muted-foreground">Complete your personal identity verification.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="pt-1 space-y-8">
                                        {kycSteps.map((step) => (
                                        <VerificationStep
                                            key={step.level}
                                            level={step.level}
                                            title={step.title}
                                            description={step.description}
                                            isCompleted={(user.kycLevel || 0) >= step.level}
                                            isCurrent={(user.kycLevel || 0) + 1 === step.level}
                                        />
                                        ))}
                                    </div>
                                    <div>
                                        <VerificationCallToAction kycLevel={user.kycLevel || 0} />
                                    </div>
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="change-password">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <KeyRound className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Change Password</h3>
                                        <p className="text-sm text-muted-foreground">For your security, we recommend choosing a password that you don't use for any other online account.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <form>
                                    <div className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">New Password</Label>
                                                <Input id="new-password" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <Input id="confirm-password" type="password" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button>Update Password</Button>
                                    </div>
                                </form>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="2fa">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Shield className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Two-Factor Authentication</h3>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="2fa-switch" className="text-base font-medium">Enable Two-Factor Authentication</Label>
                                        <p className="text-sm text-muted-foreground">Secure your account with an extra layer of protection.</p>
                                    </div>
                                    <Switch id="2fa-switch" />
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="devices-sessions" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Monitor className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Devices &amp; Sessions</h3>
                                        <p className="text-sm text-muted-foreground">This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Device</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">Chrome on macOS</div>
                                                <div className="text-sm text-muted-foreground">Current session</div>
                                            </TableCell>
                                            <TableCell>San Salvador, ES</TableCell>
                                            <TableCell>2 minutes ago</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="link" className="p-0 h-auto text-primary" disabled>Current</Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">iPhone 15 Pro</div>
                                            </TableCell>
                                            <TableCell>New York, US</TableCell>
                                            <TableCell>July 28, 2024</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline">Revoke</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
              ) : (
                 <IdentityVerification kycLevel={user.kycLevel || 0} />
              )}

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
