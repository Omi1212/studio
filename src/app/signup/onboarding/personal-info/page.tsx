'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCallingCodes } from '@/lib/country-calling-codes';
import { countries } from '@/lib/countries';

const industries = [
  { value: 'banking', label: 'Banking' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'venture_capital', label: 'Venture Capital' },
  { value: 'asset_management', label: 'Asset Management' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' },
];

const employeeRanges = [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-200', label: '51-200' },
    { value: '201-500', label: '201-500' },
    { value: '501-1000', label: '501-1000' },
    { value: '1000+', label: '1000+' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  phoneCountryCode: z.string().min(1, "Country code is required"),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  employeeRange: z.string().optional(),
  countryOfJurisdiction: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PersonalInfoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      phoneCountryCode: 'US', // Default to US
      businessName: '',
      industry: '',
      website: '',
      employeeRange: '',
      countryOfJurisdiction: '',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      let countryCode = 'US';
      let phoneNumber = parsedUser.phone || '';

      if (parsedUser.phone) {
          const foundCode = countryCallingCodes.find(c => parsedUser.phone.startsWith(c.dial_code));
          if (foundCode) {
              countryCode = foundCode.code;
              phoneNumber = parsedUser.phone.replace(foundCode.dial_code, '');
          }
      }

      form.reset({
        name: parsedUser.name || '',
        phone: phoneNumber,
        phoneCountryCode: countryCode,
        businessName: parsedUser.businessName || '',
        industry: parsedUser.industry || '',
        website: parsedUser.website || '',
        employeeRange: parsedUser.employeeRange || '',
        countryOfJurisdiction: parsedUser.countryOfJurisdiction || '',
      });
    } else {
        router.push('/signup');
    }
    setLoading(false);
  }, [form, router]);
  
  const handleContinue = async (data: FormValues) => {
    if (!user) return;

    if (user.role === 'issuer' && (!data.businessName || !data.industry || !data.countryOfJurisdiction)) {
        if (!data.businessName) {
            form.setError('businessName', { type: 'manual', message: 'Company name is required' });
        }
        if (!data.industry) {
            form.setError('industry', { type: 'manual', message: 'Industry is required' });
        }
        if (!data.countryOfJurisdiction) {
            form.setError('countryOfJurisdiction', { type: 'manual', message: 'Country of Jurisdiction is required' });
        }
        return;
    }

    setIsSubmitting(true);

    try {
        const countryCodeData = countryCallingCodes.find(c => c.code === data.phoneCountryCode);
        const fullPhoneNumber = `${countryCodeData?.dial_code || ''}${data.phone}`;

        const updatedUserData: Partial<User> = {
            name: data.name,
            phone: fullPhoneNumber,
        };

        if (user.role === 'issuer') {
            updatedUserData.businessName = data.businessName;
            updatedUserData.industry = data.industry;
            updatedUserData.website = data.website;
            updatedUserData.employeeRange = data.employeeRange;
            updatedUserData.countryOfJurisdiction = data.countryOfJurisdiction;

            if (data.businessName) {
                const newCompanyId = data.businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                localStorage.setItem('selectedCompanyId', newCompanyId);
            }
        }

        const response = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });

        if (!response.ok) {
            throw new Error('Failed to update personal information.');
        }

        const updatedUserFromApi = await response.json();
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUserFromApi));
        
        toast({
          title: 'Information Saved!',
        });

        if (user.role === 'issuer') {
            router.push('/signup/onboarding/business-details');
        } else {
            router.push('/signup/onboarding/details');
        }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Saving Info',
            description: error.message || 'Could not save your information. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-background p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-headline font-semibold">Just a few more details...</h1>
            <p className="text-muted-foreground mt-2">
                Please provide some additional information to complete your profile.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <FormLabel>Phone Number</FormLabel>
                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="phoneCountryCode"
                                    render={({ field }) => (
                                        <FormItem className="w-1/3">
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Code" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {countryCallingCodes.map(country => (
                                                        <SelectItem key={country.code} value={country.code}>
                                                            {country.dial_code}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                        <FormControl>
                                            <Input type="tel" placeholder="e.g. 555-123-4567" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {user.role === 'issuer' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>This information may be required for KYB purposes.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="businessName"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Awesome Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="countryOfJurisdiction"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Country of Jurisdiction</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a country" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countries.map(country => (
                                                    <SelectItem key={country.value} value={country.value}>
                                                        {country.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="industry"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Industry</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an industry" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {industries.map(industry => (
                                                    <SelectItem key={industry.value} value={industry.value}>
                                                        {industry.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="employeeRange"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Number of Employees</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a range" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {employeeRanges.map(range => (
                                                    <SelectItem key={range.value} value={range.value}>
                                                        {range.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="md:col-span-2">
                                     <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Company Website</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. https://awesomeinc.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                    ) : (
                    'Continue'
                    )}
                </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}
