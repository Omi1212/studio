'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const industries = [
  { value: 'banking', label: 'Banking' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'venture_capital', label: 'Venture Capital' },
  { value: 'asset_management', label: 'Asset Management' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' },
];

const businessInfoSchema = z.object({
  businessName: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

export default function BusinessInfoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

   const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: '',
      industry: '',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // If user is not an issuer, they shouldn't be on this page.
      if (parsedUser.role !== 'issuer') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      
      form.reset({
        businessName: parsedUser.businessName || '',
        industry: parsedUser.industry || '',
      });
    } else {
        router.push('/signup');
    }
    setLoading(false);
  }, [router, form]);
  
  const handleContinue = async (data: BusinessInfoFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
        const updatedUserData = {
            businessName: data.businessName,
            industry: data.industry,
        };
        
        const response = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error('Failed to update business information.');
        }

        const updatedUserFromApi = await response.json();
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUserFromApi));
        
        const newCompanyId = data.businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        localStorage.setItem('selectedCompanyId', newCompanyId);

        toast({
          title: 'Business Info Saved!',
        });

        router.push('/signup/onboarding/business-details');

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Could not save details.',
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
            <h1 className="text-3xl font-headline font-semibold">Issuer Details</h1>
            <p className="text-muted-foreground mt-2">
                A few extra details required for issuers.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                        <CardDescription>This information may be required for KYB purposes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                </Card>
              
                <div className="flex gap-2">
                     <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                        Back
                    </Button>
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
                </div>
            </form>
        </Form>
      </div>
    </div>
  );
}
