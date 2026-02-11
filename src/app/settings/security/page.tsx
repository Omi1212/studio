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
            
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        For your security, we recommend choosing a password that you don&apos;t use for any other online account.
                    </CardDescription>
                </CardHeader>
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
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>
                          Add an extra layer of security to your account by enabling two-factor authentication.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-start justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-yellow-500" />
                                <Label htmlFor="2fa-switch" className="text-base font-medium">Enable 2FA</Label>
                            </div>
                            <p className="text-sm text-muted-foreground pl-7">
                                When you sign in, you&apos;ll be asked to enter a code from your authenticator app.
                            </p>
                        </div>
                        <Switch id="2fa-switch" />
                      </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Devices & Sessions</CardTitle>
                      <CardDescription>
                          This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.
                      </CardDescription>
                  </CardHeader>
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
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
