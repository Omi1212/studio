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
import { Info, Loader2 } from 'lucide-react';
import type { AssetFormValues } from './issue-asset-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const step1Schema = z.object({
  assetName: z.string().min(1, 'Asset name is required'),
  assetTicker: z.string().min(1, 'Asset ticker is required').max(5, 'Ticker cannot exceed 5 characters'),
  assetIcon: z.any().optional(),
  assetType: z.string().min(1, 'Asset type is required'),
  eligibleInvestors: z.string().optional(),
  subscriptionTime: z.string().optional(),
  minInvestment: z.coerce.number().optional(),
  maxInvestment: z.coerce.number().optional(),
  subscriptionFees: z.coerce.number().optional(),
  redemptionTime: z.string().optional(),
  minRedemptionAmount: z.coerce.number().optional(),
  redemptionFees: z.coerce.number().optional(),
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

const eligibleInvestorTypes = [
    { value: 'U.S. Qualified Purchaser', label: 'U.S. Qualified Purchaser' },
    { value: 'Accredited Investor', label: 'Accredited Investor' },
    { value: 'Retail Investor', label: 'Retail Investor' },
    { value: 'Institutional Investor', label: 'Institutional Investor' },
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
        eligibleInvestors: defaultValues?.eligibleInvestors?.join(', ') || 'U.S. Qualified Purchaser',
        subscriptionTime: defaultValues?.subscriptionTime || 'Daily',
        minInvestment: defaultValues?.minInvestment || 5000000,
        maxInvestment: defaultValues?.maxInvestment,
        subscriptionFees: defaultValues?.subscriptionFees || 0,
        redemptionTime: defaultValues?.redemptionTime || 'Daily',
        minRedemptionAmount: defaultValues?.minRedemptionAmount || 250000,
        redemptionFees: defaultValues?.redemptionFees || 0,
    }
  });

  const handleSubmit = async (data: Step1FormValues) => {
    setIsSubmitting(true);
    const dataToSubmit = {
        ...data,
        eligibleInvestors: data.eligibleInvestors?.split(',').map(s => s.trim()).filter(Boolean),
    };
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async validation/operation
    onNext(dataToSubmit);
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

            <Separator />
            
            <Accordion type="single" collapsible className="w-full" defaultValue="primary-market">
              <AccordionItem value="primary-market" className="border-b-0">
                <AccordionTrigger className="hover:no-underline p-0">
                  <div className="space-y-2 text-left">
                      <h3 className="text-lg font-medium">Primary Market</h3>
                      <p className="text-sm text-muted-foreground">Define the terms for the primary market of your asset.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eligibleInvestors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Eligible Investors</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select investor type" />
                                  </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {eligibleInvestorTypes.map(type => (
                                      <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                          <FormDescription>
                            Define the type of investor eligible for this asset.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                        control={form.control}
                        name="subscriptionTime"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Subscription Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subscription time" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="minInvestment"
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex items-center gap-2">
                                <FormLabel>Min. Investment</FormLabel>
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The minimum investment amount required.</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" placeholder="5,000,000" {...field} />
                                    <span className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">USDC</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="maxInvestment"
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex items-center gap-2">
                                <FormLabel>Max. Investment</FormLabel>
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The maximum investment amount allowed (optional).</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" placeholder="10,000,000" {...field} />
                                    <span className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">USDC</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subscriptionFees"
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex items-center gap-2">
                                <FormLabel>Order Fee</FormLabel>
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Fees applied at the time of subscription.</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" placeholder="0" {...field} />
                                    <span className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">%</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="redemptionTime"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Redemption Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select redemption time" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="minRedemptionAmount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Minimum Redemption Amount</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" placeholder="250,000" {...field} />
                                    <span className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">USDC</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="redemptionFees"
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex items-center gap-2">
                                <FormLabel>Redemption Fees</FormLabel>
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Fees applied at the time of redemption.</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" placeholder="0" {...field} />
                                    <span className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">%</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
