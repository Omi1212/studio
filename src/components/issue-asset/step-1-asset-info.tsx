'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useState, Ref } from 'react';
import { Loader2 } from 'lucide-react';
import type { AssetFormValues } from './issue-asset-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const step1Schema = z.object({
  assetName: z.string().min(1, 'Asset name is required'),
  assetTicker: z.string().min(1, 'Asset ticker is required').max(5, 'Ticker cannot exceed 5 characters'),
  assetIcon: z.any().optional(),
  assetType: z.string().min(1, 'Asset type is required'),
});

type Step1FormValues = z.infer<typeof step1Schema>;

interface Step1AssetInfoProps {
  onNext: (data: Partial<AssetFormValues>) => void;
  defaultValues?: Partial<AssetFormValues>;
  formRef: Ref<HTMLFormElement>;
}

const assetTypes = [
    { value: 'security_token', label: 'Security Token' },
    { value: 'utility_token', label: 'Utility Token' },
    { value: 'stablecoin', label: 'Stablecoin' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' },
];

export default function Step1AssetInfo({ onNext, defaultValues, formRef }: Step1AssetInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
        assetName: defaultValues?.assetName || '',
        assetTicker: defaultValues?.assetTicker || '',
        assetIcon: defaultValues?.assetIcon,
        assetType: defaultValues?.assetType || '',
    }
  });

  const handleSubmit = async (data: Step1FormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async validation/operation
    onNext(data);
    setIsSubmitting(false);
  };
  
  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. My Awesome Asset" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetTicker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. MAA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="assetType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an asset type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {assetTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
              name="assetIcon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Icon</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="w-full">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} 
                          className="h-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image for your asset (e.g., PNG, JPG, SVG).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Next
                </>
              ) : (
                'Next'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
