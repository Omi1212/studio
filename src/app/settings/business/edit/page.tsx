'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { User } from '@/lib/types';
import { countries } from '@/lib/countries';
import { countryCallingCodes } from '@/lib/country-calling-codes';
import { Skeleton } from '@/components/ui/skeleton';

const industries = [
  { value: 'banking', label: 'Banking' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'venture_capital', label: 'Venture Capital' },
  { value: 'asset_management', label: 'Asset Management' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

const currencies = [
  { value: 'usd', label: 'US Dollar (USD)' },
  { value: 'eur', label: 'Euro (EUR)' },
  { value: 'btc', label: 'Bitcoin (BTC)' },
];


export default function EditBusinessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      fetch(`/api/users/${parsedUser.id}`)
        .then(res => {
          if (!res.ok) throw new Error('User not found');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(err => {
          console.error(err);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
        router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const phoneCountryCodeData = countryCallingCodes.find(c => c.code === formData.get('phoneCountryCode'));
    const fullPhoneNumber = `${phoneCountryCodeData?.dial_code || ''}${formData.get('phone')}`;

    const updatedUserData = {
      businessName: formData.get('businessName') as string,
      legalName: formData.get('legalName') as string,
      phone: fullPhoneNumber,
      industry: formData.get('industry') as string,
      country: formData.get('country') as string,
      currency: formData.get('currency') as string,
      language: formData.get('language') as string,
    };
    
    try {
        const response = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData),
        });
        if (!response.ok) throw new Error('Failed to update business details');

        const updatedUser = await response.json();

        // Update user in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...updatedUser }));

        toast({
          title: 'Business Information Updated',
          description: `Your business details have been saved.`,
        });
        router.push(`/settings/general`);
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update business details.' });
    }
  };

  const getPhoneParts = (fullPhone?: string) => {
    if (!fullPhone) return { code: 'US', number: '' };
    const foundCode = countryCallingCodes.find(c => fullPhone.startsWith(c.dial_code));
    if (foundCode) {
        return { code: foundCode.code, number: fullPhone.replace(foundCode.dial_code, '') };
    }
    return { code: 'US', number: fullPhone };
  };

  if (loading) {
    return (
      <SidebarProvider>
        <Sidebar className="border-r">
          <SidebarNav />
        </Sidebar>
        <SidebarInset>
            <div className="flex flex-col min-h-dvh">
            <HeaderDynamic />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
              <Skeleton className="w-full max-w-4xl h-[600px]" />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!user) {
    return null; // Or a message saying user not found
  }

  const { code: phoneCode, number: phoneNumber } = getPhoneParts(user.phone);

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
            <Card className="w-full max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Edit Business Information</CardTitle>
                        <CardDescription>Update the details for your business.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <Label htmlFor="businessName">Business Name</Label>
                              <Input id="businessName" name="businessName" defaultValue={user.businessName} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="legalName">Legal Name</Label>
                              <Input id="legalName" name="legalName" defaultValue={user.legalName} />
                          </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <div className="flex gap-2">
                                <Select name="phoneCountryCode" defaultValue={phoneCode}>
                                    <SelectTrigger className="w-1/3">
                                        <SelectValue placeholder="Code" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countryCallingCodes.map(country => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.dial_code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input name="phone" type="tel" placeholder="e.g. 555-123-4567" defaultValue={phoneNumber} className="flex-1" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select name="industry" defaultValue={user.industry}>
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map(industry => (
                                        <SelectItem key={industry.value} value={industry.value}>
                                            {industry.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country of Residence</Label>
                                <Select name="country" defaultValue={user.country}>
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(country => (
                                            <SelectItem key={country.value} value={country.value}>
                                                {country.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select name="currency" defaultValue={user.currency}>
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map(curr => (
                                            <SelectItem key={curr.value} value={curr.value}>
                                                {curr.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="language">Default Language</Label>
                                <Select name="language" defaultValue={user.language}>
                                    <SelectTrigger id="language">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(lang => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/settings/general">Cancel</Link>
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </CardFooter>
                </form>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
