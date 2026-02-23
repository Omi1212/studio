
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import { useToast } from '@/hooks/use-toast';
import { Stepper, StepperItem } from '@/components/ui/stepper';
import Step1AssetInfo from '@/components/issue-asset/step-1-asset-info';
import { AssetFormValues } from '@/components/issue-asset/issue-asset-form';
import Step2AssetDetails from '@/components/issue-asset/step-2-asset-details';
import Step3Documents from '@/components/issue-asset/step-3-documents';
import Step4Network from '@/components/issue-asset/step-4-network';
import Step5Review from '@/components/issue-asset/step-5-asset-review';
import { Button } from '@/components/ui/button';
import type { Issuer } from '@/lib/types';
import Link from 'next/link';

export default function NewAssetPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [formData, setFormData] = useState<Partial<AssetFormValues>>({
    assetName: 'Ingeniería Coin',
    assetTicker: 'ING',
    destinationAddress: 'spark1pgssyd5f0685tu3v2hpqv2rx9cxu6vskyzjulwepzq79kd583gyw4z0gp92kjc',
    decimals: 6,
    maxSupply: 1_000_000_000000,
    isFreezable: true,
    network: ['spark'],
    assetType: 'utility_token',
  });
  const { toast } = useToast();
  const router = useRouter();

  const stepFormRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    fetch('/api/issuers?perPage=1000').then(res => res.json()).then(response => setIssuers(response.data));
  }, []);

  const steps = [
    { id: 1, label: 'Asset Information' },
    { id: 2, label: 'Asset Details' },
    { id: 3, label: 'Documents' },
    { id: 4, label: 'Network' },
    { id: 5, label: 'Review' },
  ];

  const handleNext = (data: Partial<AssetFormValues>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  const handleSaveDraft = () => {
    toast({
      title: 'Drafts Not Persisted',
      description: `Drafts are not saved in this demonstration. Please complete the form in one session.`,
    });
  };

  const handleFinalSubmit = async (data: Partial<AssetFormValues>) => {
    const finalData = { ...formData, ...data } as AssetFormValues;
    
    if (issuers.length < 2) {
        toast({ title: 'Error', description: 'Not enough issuer data to submit.'});
        return;
    }

    const newAssetData = { 
      ...finalData, 
      status: 'pending',
      issuerId: issuers[1].id, // For demo purposes, assign to AssetForge
    };
    
    // Remove file objects before sending to API
    delete (newAssetData as any).assetIcon;
    delete (newAssetData as any).whitepaper;
    delete (newAssetData as any).legalAssetizationDoc;
    delete (newAssetData as any).assetIssuanceLegalDoc;

    try {
        const response = await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAssetData),
        });
        if (!response.ok) throw new Error('Failed to submit asset request');
        
        const createdAsset = await response.json();

        toast({
          title: 'Request Submitted!',
          description: `Your new asset "${createdAsset.assetName}" has been submitted for review.`,
        });
        router.push('/issue-asset');

    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not submit asset request.' });
    }
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
              <div className="w-full max-w-6xl">
                <>
                  <div className="flex justify-between items-center mb-8">
                      <h1 className="text-3xl font-headline font-semibold">
                        Create a New Asset
                      </h1>
                      <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={handleSaveDraft}>Save as Draft</Button>
                          <Button variant="outline" asChild>
                              <Link href="/issue-asset">Cancel</Link>
                          </Button>
                      </div>
                  </div>

                  <p className="text-muted-foreground mb-8">
                    Create and issue a new asset on the network.
                  </p>
                  <div className="mb-8 hidden sm:block">
                    <Stepper totalSteps={steps.length}>
                      {steps.map((step) => (
                        <StepperItem
                          key={step.id}
                          step={step.id}
                          isLastStep={step.id === steps.length}
                          isActive={currentStep === step.id}
                          isCompleted={currentStep > step.id}
                        >
                          {step.label}
                        </StepperItem>
                      ))}
                    </Stepper>
                  </div>
                    <div className="sm:hidden mb-8">
                    <p className="text-center text-sm text-muted-foreground">Step {currentStep} of {steps.length}: {steps[currentStep-1].label}</p>
                  </div>

                  <div className="flex justify-center pb-8">
                    <div className="w-full max-w-2xl">
                      {currentStep === 1 && (
                        <Step1AssetInfo
                          formRef={stepFormRef}
                          onNext={handleNext}
                          defaultValues={formData}
                        />
                      )}
                      {currentStep === 2 && (
                        <Step2AssetDetails
                          formRef={stepFormRef}
                          onBack={handleBack}
                          onNext={handleNext}
                          defaultValues={formData}
                        />
                      )}
                        {currentStep === 3 && (
                        <Step3Documents
                          formRef={stepFormRef}
                          onBack={handleBack}
                          onNext={handleNext}
                          defaultValues={formData}
                        />
                      )}
                        {currentStep === 4 && (
                        <Step4Network
                          formRef={stepFormRef}
                          onBack={handleBack}
                          onNext={handleNext}
                          defaultValues={formData}
                        />
                      )}
                        {currentStep === 5 && (
                        <Step5Review
                          onBack={handleBack}
                          onSubmit={handleFinalSubmit}
                          formData={formData as AssetFormValues}
                          onSaveDraft={handleSaveDraft}
                        />
                      )}
                    </div>
                  </div>
                </>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
