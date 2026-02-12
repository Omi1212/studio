
'use client';

import React from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, KeyRound, Smartphone, Monitor, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const sessions = [
    {
        id: 'session-1',
        isCurrent: true,
        browser: 'Chrome',
        os: 'on macOS',
        location: 'San Salvador, El Salvador',
        lastAccessed: 'Now',
        icon: <Monitor className="h-6 w-6 text-muted-foreground" />,
    },
    {
        id: 'session-2',
        isCurrent: false,
        browser: 'Safari',
        os: 'on iPhone',
        location: 'Santa Tecla, El Salvador',
        lastAccessed: '2 hours ago',
        icon: <Smartphone className="h-6 w-6 text-muted-foreground" />,
    }
];


export default function SecurityPage() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/settings"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Security & Access
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-6">
                    <AccordionItem value="password" className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <KeyRound className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Change Password</h3>
                                        <p className="text-sm text-muted-foreground">For your security, we recommend choosing a password that you don&apos;t use for any other online account.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0">
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm Password</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Change Password</Button>
                                </CardFooter>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>

                    <AccordionItem value="2fa" className="border-b-0">
                        <Card>
                             <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <ShieldAlert className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Two-Factor Authentication</h3>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0">
                                <CardContent className="space-y-4">
                                    <div className="flex items-start justify-between rounded-lg border p-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="2fa-app-switch" className="text-base font-medium flex items-center gap-2">
                                                <ShieldAlert className="h-5 w-5 text-yellow-500" />
                                                Authenticator App
                                            </Label>
                                            <p className="text-sm text-muted-foreground pl-7">
                                                Use an app like Google Authenticator to get codes.
                                            </p>
                                        </div>
                                        <Switch id="2fa-app-switch" />
                                    </div>
                                    <div className="flex items-start justify-between rounded-lg border p-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="2fa-sms-switch" className="text-base font-medium flex items-center gap-2">
                                                <Smartphone className="h-5 w-5 text-blue-500" />
                                                SMS Text Message
                                            </Label>
                                            <p className="text-sm text-muted-foreground pl-7">
                                                Receive a code via text message to your phone.
                                            </p>
                                        </div>
                                        <Switch id="2fa-sms-switch" />
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>

                    <AccordionItem value="sessions" className="border-b-0">
                         <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Monitor className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Devices & Sessions</h3>
                                        <p className="text-sm text-muted-foreground">This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0">
                                <CardContent className="space-y-4">
                                    {sessions.map((session, index) => (
                                        <React.Fragment key={session.id}>
                                            {index > 0 && <Separator />}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {session.icon}
                                                    <div>
                                                        <p className="font-medium">{session.browser} {session.os}</p>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <span>{session.location}</span>
                                                            {session.isCurrent && <span className="text-green-500 font-semibold">• Current session</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">{session.lastAccessed}</p>
                                                    {!session.isCurrent && <Button variant="link" className="text-red-500 h-auto p-0 text-sm">Log out</Button>}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
