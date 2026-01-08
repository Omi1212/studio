'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useToast } from '@/hooks/use-toast';
import { Stepper, StepperItem } from '@/components/ui/stepper';
import Step1TokenInfo from '@/components/issue-token/step-1-token-info';
import { TokenFormValues } from '@/components/issue-token/issue-token-form';
import TokenOverview from '@/components/issue-token/token-overview';
import { Button } from '@/components/ui/button';
import Step2TokenDetails from '@/components/issue-token/step-2-token-details';

export interface TokenDetails extends TokenFormValues {
  id: string;
  publicKey: string;
}

export default function IssueTokenPage() {
  const [createdToken, setCreatedToken] = useState<TokenDetails | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TokenFormValues>>({
    tokenName: 'Ingeniería Coin',
    tokenTicker: 'ING',
    destinationAddress: 'spark1pgssyd5f0685tu3v2hpqv2rx9cxu6vskyzjulwepzq79kd583gyw4z0gp92kjc',
    decimals: 6,
    maxSupply: 1_000_000_000000,
    isFreezable: true,
  });
  const { toast } = useToast();

  const steps = [
    { id: 1, label: 'Token Information' },
    { id: 2, label: 'Token Details' },
    { id: 3, label: 'Confirmation' },
  ];

  const handleNext = (data: Partial<TokenFormValues>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleTokenCreate = (data: TokenFormValues) => {
    console.log('Creating token with:', data);
    const newId = `btkn176av2...${Math.random().toString(36).substring(2, 10)}`;
    const newPublicKey = `03a0626e30...${Math.random().toString(36).substring(2, 10)}`;

    const finalData = { ...formData, ...data } as TokenFormValues;
    setCreatedToken({ ...finalData, id: newId, publicKey: newPublicKey });

    toast({
      title: 'Token Issued Successfully!',
      description: `Your new token "${finalData.tokenName}" has been created on the network.`,
    });
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                {!createdToken ? (
                  <>
                    <h1 className="text-3xl font-headline font-semibold mb-2">
                      Workspace
                    </h1>
                    <p className="text-muted-foreground mb-8">
                      Create and issue a new token on the network.
                    </p>
                    <div className="mb-8">
                      <Stepper>
                        {steps.map((step) => (
                          <StepperItem
                            key={step.id}
                            step={step.id}
                            isActive={currentStep === step.id}
                            isCompleted={currentStep > step.id}
                          >
                            {step.label}
                          </StepperItem>
                        ))}
                      </Stepper>
                    </div>

                    <div className="flex justify-center pb-8">
                      <div className="w-full max-w-2xl">
                        {currentStep === 1 && (
                          <Step1TokenInfo
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                        {currentStep === 2 && (
                          <Step2TokenDetails
                            onBack={handleBack}
                            onNext={handleNext}
                            defaultValues={formData}
                          />
                        )}
                         {currentStep === 3 && (
                          <div>
                            <h2 className="text-xl font-semibold mb-4">
                              Step 3: Confirmation
                            </h2>
                            <p>Coming soon...</p>
                             <Button onClick={handleBack} variant="outline">Back</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <TokenOverview token={createdToken} />
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
