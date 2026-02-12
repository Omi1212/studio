'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, MoreVertical, Mail, Smartphone, Settings } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
            
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-6">
                  {/* Email Notifications Section */}
                  <AccordionItem value="email" className="border-b-0">
                      <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-left">
                              <div className="flex items-center gap-4">
                                  <Mail className="h-6 w-6" />
                                  <div className="space-y-1 text-left">
                                      <h3 className="text-lg font-semibold leading-none tracking-tight">Email Notifications</h3>
                                      <p className="text-sm text-muted-foreground">Manage your email addresses and notification preferences.</p>
                                  </div>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0">
                              <div className="space-y-6">
                                  <div className="space-y-4">
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
                                  </div>
                                  
                                  <div>
                                      <div className="mb-4">
                                          <Table>
                                              <TableHeader>
                                                  <TableRow>
                                                      <TableHead>Email Address</TableHead>
                                                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                                                      <TableHead className="hidden md:table-cell">Date Added</TableHead>
                                                      <TableHead className="text-right">Actions</TableHead>
                                                  </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                  <TableRow>
                                                      <TableCell>
                                                          <div className="flex items-center gap-3">
                                                              <Mail className="h-4 w-4 text-muted-foreground" />
                                                              <div>
                                                                  <p className="font-medium">superadmin@gmail.com</p>
                                                                  <Badge variant="secondary" className="mt-1">Primary</Badge>
                                                              </div>
                                                          </div>
                                                      </TableCell>
                                                      <TableCell className="hidden sm:table-cell">
                                                          <Badge variant="outline" className="text-green-400 border-green-400">Verified</Badge>
                                                      </TableCell>
                                                      <TableCell className="hidden md:table-cell">Jan 15, 2024</TableCell>
                                                      <TableCell className="text-right">
                                                          <DropdownMenu>
                                                              <DropdownMenuTrigger asChild>
                                                                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                                              </DropdownMenuTrigger>
                                                              <DropdownMenuContent align="end">
                                                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                                              </DropdownMenuContent>
                                                          </DropdownMenu>
                                                      </TableCell>
                                                  </TableRow>
                                              </TableBody>
                                          </Table>
                                      </div>
                                      <div className="flex justify-end">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                              <Button>
                                                  <Plus className="mr-2 h-4 w-4" />
                                                  Add Email Address
                                              </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                              <DialogHeader>
                                                  <DialogTitle>Add a new email address</DialogTitle>
                                                  <DialogDescription>
                                                      We will send a verification link to this email address.
                                                  </DialogDescription>
                                              </DialogHeader>
                                              <div className="grid gap-4 py-4">
                                                  <div className="grid grid-cols-4 items-center gap-4">
                                                      <Label htmlFor="email" className="text-right">Email</Label>
                                                      <Input id="email" type="email" placeholder="name@example.com" className="col-span-3" />
                                                  </div>
                                              </div>
                                              <DialogFooter>
                                                  <DialogClose asChild>
                                                      <Button type="button" variant="ghost">Cancel</Button>
                                                  </DialogClose>
                                                  <Button type="submit">Add and Verify</Button>
                                              </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                  </div>
                              </div>
                          </AccordionContent>
                      </Card>
                  </AccordionItem>

                  {/* Push Notifications Section */}
                  <AccordionItem value="push" className="border-b-0">
                      <Card>
                          <AccordionTrigger className="p-6 hover:no-underline text-left">
                              <div className="flex items-center gap-4">
                                  <Smartphone className="h-6 w-6" />
                                  <div className="space-y-1 text-left">
                                      <h3 className="text-lg font-semibold leading-none tracking-tight">Push Notifications</h3>
                                      <p className="text-sm text-muted-foreground">Manage push notifications on your devices.</p>
                                  </div>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0">
                              <div className="space-y-4">
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
                              </div>
                          </AccordionContent>
                      </Card>
                  </AccordionItem>
                  
                  {/* Global Settings Section */}
                  <AccordionItem value="global-settings" className="border-b-0">
                      <Card>
                          <AccordionTrigger className="p-6 hover:no-underline text-left">
                              <div className="flex items-center gap-4">
                                  <Settings className="h-6 w-6" />
                                  <div className="space-y-1 text-left">
                                      <h3 className="text-lg font-semibold leading-none tracking-tight">Notification Settings</h3>
                                      <p className="text-sm text-muted-foreground">Global notification controls.</p>
                                  </div>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0">
                              <div className="flex items-center justify-between rounded-lg border p-4">
                                  <Label htmlFor="disable-all" className="flex flex-col space-y-1">
                                      <span className="font-medium">Disable All Notifications</span>
                                      <span className="font-normal leading-snug text-muted-foreground">
                                          Completely turn off all notifications.
                                      </span>
                                  </Label>
                                  <Switch id="disable-all" />
                              </div>
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
