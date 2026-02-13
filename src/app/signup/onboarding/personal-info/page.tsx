'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCallingCodes } from '@/lib/country-calling-codes';

const personalInfoSchema = z.object({
  legalName: z.string().min(1, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(1, 'Phone number is required'),
  phoneCountryCode: z.string().min(1, "Country code is required"),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      legalName: '',
      dob: '',
      phone: '',
      phoneCountryCode: 'US', // Default to US
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
        legalName: parsedUser.legalName || parsedUser.name || '',
        phone: phoneNumber,
        phoneCountryCode: countryCode,
        dob: parsedUser.dob || ''
      });
    } else {
        router.push('/signup');
    }
    setLoading(false);
  }, [form, router]);
  
  const handleContinue = async (data: PersonalInfoFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
        const countryCodeData = countryCallingCodes.find(c => c.code === data.phoneCountryCode);
        const fullPhoneNumber = `${countryCodeData?.dial_code || ''}${data.phone}`;

        const updatedUserData = {
            name: data.legalName, // Also update name field for display purposes
            legalName: data.legalName,
            phone: fullPhoneNumber,
            dob: data.dob,
        };

        const response = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });

        if (!response.ok) {
            throw new Error('Failed to update personal information.');
        }

        const updatedUserFromApi = await response.json();
        
        // Update currentUser in localStorage with the latest data from the API
        localStorage.setItem('currentUser', JSON.stringify(updatedUserFromApi));
        
        toast({
          title: 'Personal Info Saved!',
        });

        if (updatedUserFromApi.role === 'issuer') {
            router.push('/signup/onboarding/business-info');
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
                            name="legalName"
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
                         <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
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
                    <CardFooter>
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
                    </CardFooter>
                </Card>
            </form>
        </Form>
      </div>
    </div>
  );
}
