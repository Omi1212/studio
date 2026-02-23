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
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useState, Ref } from 'react';
import { Loader2 } from 'lucide-react';
import type { AssetFormValues } from '../issue-asset/issue-asset-form';

const step2Schema = z.object({
  decimals: z.coerce.number().int().min(0).max(18),
  maxSupply: z.coerce.number().positive('Max supply must be a positive number'),
  isFreezable: z.boolean(),
});

type Step2FormValues = z.infer<typeof step2Schema>;

interface Step2AssetDetailsProps {
  onNext: (data: Partial<AssetFormValues>) => void;
  onBack: () => void;
  defaultValues?: Partial<AssetFormValues>;
  formRef: Ref<HTMLFormElement>;
}

export default function Step2TokenDetails({ onNext, onBack, defaultValues, formRef }: Step2AssetDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      decimals: defaultValues?.decimals || 6,
      maxSupply: defaultValues?.maxSupply || 1_000_000_000000,
      isFreezable: defaultValues?.isFreezable ?? true,
    }
  });

  const handleSubmit = async (data: Step2FormValues) => {
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
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimals</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The number of decimal places the asset can have (0-18).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Supply</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The maximum number of assets that can be minted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFreezable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Is Freezable?</FormLabel>
                    <FormDescription>
                      Can the asset supply be frozen by the issuer?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
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
