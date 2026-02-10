'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

function NotificationRow({ title, description, id }: { title: string; description: string; id: string; }) {
    return (
        <div className="flex items-start justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor={id} className="text-base font-medium">{title}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch id={id} />
        </div>
    );
}


export default function NotificationsPage() {
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
                    Notifications & Alerts
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Email Notifications</CardTitle>
                      <CardDescription>Manage what emails you receive from us.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <NotificationRow 
                        id="email-orders"
                        title="Order Updates"
                        description="Receive email notifications for order status changes."
                      />
                       <NotificationRow 
                        id="email-transfers"
                        title="Transfer Updates"
                        description="Receive email notifications for token transfers."
                      />
                       <NotificationRow 
                        id="email-news"
                        title="Newsletter"
                        description="Subscribe to our weekly newsletter."
                      />
                  </CardContent>
              </Card>

               <Card>
                  <CardHeader>
                      <CardTitle>Push Notifications</CardTitle>
                      <CardDescription>Manage push notifications on your devices.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                       <NotificationRow 
                        id="push-orders"
                        title="Order Updates"
                        description="Receive push notifications for order status changes."
                      />
                       <NotificationRow 
                        id="push-security"
                        title="Security Alerts"
                        description="Receive instant alerts for important security events."
                      />
                  </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                         <Label htmlFor="disable-all" className="flex flex-col space-y-1">
                            <span className="font-medium">Disable All Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Completely turn off all notifications.
                            </span>
                        </Label>
                        <Switch id="disable-all" />
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
