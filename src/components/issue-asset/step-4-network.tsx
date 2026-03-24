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
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import Image from 'next/image';

const step4Schema = z.object({
  network: z.array(z.string()).min(1, 'Please select at least one network'),
  destinationAddress: z.string().min(1, 'Destination address is required'),
});

type Step4FormValues = z.infer<typeof step4Schema>;

interface Step4NetworkProps {
  onNext: (data: Partial<AssetFormValues>) => void;
  onBack: () => void;
  defaultValues?: Partial<AssetFormValues>;
  formRef: Ref<HTMLFormElement>;
}

const networks = [
    { 
        id: 'spark', 
        name: 'Spark Network', 
        icon: <svg width="24" height="24" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>,
        description: {
            whatIsIt: 'High-speed assets built on the Bitcoin Lightning Network. They enable instant, low-fee peer-to-peer transactions without waiting for block confirmations.',
            bestFor: [
                'Micro-payments: Paying for coffee, content, or tips.',
                'Gaming: In-game currency and rewards.',
                'Consumer Apps: High-frequency transactions where speed is critical.',
            ]
        }
    },
    { 
        id: 'liquid', 
        name: 'Liquid Network', 
        icon: <Image src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" width={24} height={24} />,
        description: {
            whatIsIt: 'A Bitcoin sidechain designed for high-performance asset issuance. It offers faster settlement than the main chain (2 minutes) and "Confidential Transactions," which hide asset amounts and types from the public eye.',
            bestFor: [
                'Stablecoins: Digital fiat currencies (USD/EUR).',
                'Security Assets: Tokenized stocks, bonds, or real estate.',
                'Trading: Moving funds between exchanges quickly and privately.',
            ]
        }
    },
    { 
        id: 'rgb', 
        name: 'RGB Protocol', 
        icon: <Image src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" width={24} height={24} />,
        description: {
            whatIsIt: 'A client-side validation protocol for smart contracts. RGB keeps asset data off-chain (stored locally on your device) while using the Bitcoin blockchain only for commitment. It offers the highest level of privacy and scalability.',
            bestFor: [
                'Maximum Privacy: Assets that leave no trace on the blockchain.',
                'Complex Smart Contracts: DAOs and programmable assets.',
                'Digital Collectibles: Unique assets with private metadata.',
            ]
        }
    },
    { 
        id: 'ark', 
        name: 'Arkade Assets', 
        icon: <Image src="https://i.ibb.co/sdg2tRxK/imagen-2026-03-24-075321289.png" alt="Arkade Assets Logo" width={24} height={24} />,
        description: {
            whatIsIt: 'A second-layer protocol for off-chain transactions. It allows users to make payments without requiring a direct or indirect channel with the payee.',
            bestFor: [
                'Scalable Payments: Serving a large user base without on-chain congestion.',
                'Enhanced Privacy: Transactions are settled off-chain, providing better privacy.',
                'Uninterrupted Service: Users can receive payments even when they are offline.',
            ]
        }
    },
    {
        id: 'taproot',
        name: 'Taproot Assets',
        icon: <Image src="https://docs.lightning.engineering/~gitbook/image?url=https%3A%2F%2F2545062540-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MIzyiDsFtJBYVyhr1nT%252Favatar-1602260100761.png%3Fgeneration%3D1602260100982225%26alt%3Dmedia&width=32&dpr=2&quality=100&sign=15d20b51&sv=2" alt="Taproot Assets Logo" width={24} height={24} />,
        description: {
            whatIsIt: 'A standard for minting assets on Bitcoin using Taproot. It embeds asset data efficiently and acts as a bridge to move assets to the Lightning Network.',
            bestFor: [
                'Asset Minting: The initial creation and issuance of assets.',
                'On-Chain Storage: Holding assets securely on the main Bitcoin blockchain.',
                'Bridging: Developers building custom solutions to move assets between Layer 1 and Layer 2.',
            ]
        }
    }
]

export default function Step4Network({ onNext, onBack, defaultValues, formRef }: Step4NetworkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Step4FormValues>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      network: Array.isArray(defaultValues?.network) ? defaultValues.network : (defaultValues?.network ? [defaultValues.network] : []),
      destinationAddress: defaultValues?.destinationAddress || '',
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
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
             <FormField
              control={form.control}
              name="destinationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. spark1..." {...field} />
                  </FormControl>
                   <FormDescription>
                    The address that will receive the initial supply of assets.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Network</FormLabel>
                   <FormDescription>
                    Select one or more networks to issue your asset on.
                  </FormDescription>
                  <FormControl>
                    <Accordion
                      type="multiple"
                      className="w-full space-y-4"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {networks.map((network) => (
                        <AccordionItem key={network.id} value={network.id} className="border-b-0">
                            <Card className={cn("overflow-hidden", (field.value?.includes(network.id) || network.id === 'spark') && "border-2 border-primary")}>
                                <AccordionTrigger className="p-6 hover:no-underline">
                                    <div className="flex items-center gap-4">
                                        {network.icon}
                                        <span className="font-semibold">{network.name}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-0">
                                  <Separator className="mb-4" />
                                    <div className="text-muted-foreground space-y-4 text-sm">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">What is it?</h4>
                                            <p>{network.description.whatIsIt}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Best for:</h4>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {network.description.bestFor.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </FormControl>
                  <FormMessage />
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
