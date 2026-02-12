'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DataManagementPage() {
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
                    Data Management
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-6">
                    <AccordionItem value="download-reports" className="border-b-0">
                        <Card>
                             <AccordionTrigger className="p-6 hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                    <Download className="h-6 w-6" />
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight">Download Reports</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Generate and download your transaction reports and other data.
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                             <AccordionContent className="pt-0">
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="report-type">Report Type</Label>
                                        <Select defaultValue="transactions">
                                            <SelectTrigger id="report-type">
                                                <SelectValue placeholder="Select a report type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="transactions">Transaction History</SelectItem>
                                                <SelectItem value="orders">Order History</SelectItem>
                                                <SelectItem value="holdings">Current Holdings</SelectItem>
                                                <SelectItem value="full">Full Account Data</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file-format">File Format</Label>
                                        <Select defaultValue="csv">
                                            <SelectTrigger id="file-format">
                                                <SelectValue placeholder="Select a file format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="csv">CSV</SelectItem>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="json">JSON</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full sm:w-auto">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Report
                                    </Button>
                                </CardFooter>
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
