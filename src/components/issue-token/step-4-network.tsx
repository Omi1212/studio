
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Zap, Droplets, Rss } from 'lucide-react';
import type { TokenFormValues } from './issue-token-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';

const step4Schema = z.object({
  network: z.string().min(1, 'Please select a network'),
});

type Step4FormValues = z.infer<typeof step4Schema>;

interface Step4NetworkProps {
  onNext: (data: Partial<TokenFormValues>) => void;
  onBack: () => void;
  defaultValues?: Partial<TokenFormValues>;
}

const networks = [
    { id: 'spark', name: 'Spark Network', icon: <Zap className="h-6 w-6" /> },
    { id: 'liquid', name: 'Liquid Network', icon: <Droplets className="h-6 w-6" /> },
    { id: 'rgb', name: 'RGB Protocol', icon: <Rss className="h-6 w-6" /> },
]

export default function Step4Network({ onNext, onBack, defaultValues }: Step4NetworkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step4FormValues>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      network: defaultValues?.network || 'spark',
    }
  });

  const handleSubmit = async (data: Step4FormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async validation/operation
    onNext(data);
    setIsSubmitting(false);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 gap-4"
                  >
                    {networks.map(network => (
                        <FormItem key={network.id} className="w-full">
                            <FormControl>
                                <RadioGroupItem value={network.id} className="sr-only" />
                            </FormControl>
                            <FormLabel
                                htmlFor={field.name}
                                className={cn(
                                'flex flex-row items-center justify-start gap-4 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                                field.value === network.id && 'border-primary'
                                )}
                            >
                                {network.icon}
                                <span className="font-semibold">{network.name}</span>
                            </FormLabel>
                        </FormItem>
                    ))}
                  </RadioGroup>
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
