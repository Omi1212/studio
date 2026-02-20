
'use client';

import { useEffect, useState, use } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import HeaderDynamic from '@/components/dashboard/header-dynamic';
import type { AssetDetails, Issuer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, FileText, HardDrive, Hash, Image as ImageIcon, Info, Network, ToggleRight, User, X, Download, Eye, Tag, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Stepper, StepperItem } from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type CombinedRequest = AssetDetails & { issuer?: Issuer };

function ReviewSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">{title}</h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    )
}

function ReviewRow({ icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) {
    const Icon = icon;
    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <div className="text-sm font-medium break-words text-right max-w-[60%] sm:max-w-[70%]">
                {value}
            </div>
        </div>
    )
}

function FilePreview({ file, fileName }: { file: any, fileName: string }) {
    if (!file) return <span className="text-muted-foreground">Not provided</span>;
    
    // Create a blob URL for preview/download if it's a file object
    const fileUrl = (file instanceof File || (typeof file === 'object' && 'name' in file)) 
        ? URL.createObjectURL(file as File) 
        : '#';

    return (
        <div className="flex items-center gap-2 text-sm justify-end">
            <span className="truncate max-w-40" title={fileName}>{fileName}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <a href={fileUrl} download={fileName}><Download className="h-4 w-4" /></a>
            </Button>
        </div>
    )
}

const steps = [
    { id: 1, label: 'Asset Info' },
    { id: 2, label: 'Asset Details' },
    { id: 3, label: 'Documents' },
    { id: 4, label: 'Issuer & Action' },
];

function RequestDetailsPage({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<CombinedRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const networkMap: { [key: string]: string } = {
    spark: 'Spark',
    liquid: 'Liquid',
    rgb: 'RGB',
    taproot: 'Taproot Assets',
  };

  useEffect(() => {
    const { id } = params;
    if (!id) return;

    setLoading(true);
    fetch(`/api/assets/${id}`)
      .then(res => {
        if(res.ok) return res.json();
        throw new Error('Asset not found');
      })
      .then((foundAsset: AssetDetails) => {
        if (foundAsset.issuerId) {
            return fetch(`/api/issuers/${foundAsset.issuerId}`)
                .then(res => res.json())
                .then(issuer => ({ ...foundAsset, issuer }));
        }
        return foundAsset;
      })
      .then((combinedData: CombinedRequest) => {
          // Add fake documents if they don't exist for review purposes
          if (!combinedData.whitepaper) {
            const fakeFile = new File(["fake content"], `${combinedData.assetTicker}_Whitepaper.pdf`, { type: "application/pdf" });
            combinedData.whitepaper = [fakeFile] as any;
          }
          if (!combinedData.legalAssetizationDoc) {
            const fakeFile = new File(["fake content"], `Legal_Assetization.pdf`, { type: "application/pdf" });
            combinedData.legalAssetizationDoc = [fakeFile] as any;
          }
          if (!combinedData.assetIssuanceLegalDoc) {
            const fakeFile = new File(["fake content"], `Asset_Issuance_Agreement.pdf`, { type: "application/pdf" });
            combinedData.assetIssuanceLegalDoc = [fakeFile] as any;
          }

          setRequest(combinedData);

          const assetIcon = combinedData.assetIcon;

          if (assetIcon) {
            if (typeof assetIcon === 'string') {
              setIconPreview(assetIcon);
            } else if (assetIcon instanceof File || (typeof assetIcon === 'object' && 'name' in assetIcon)) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setIconPreview(reader.result as string);
              }
              reader.readAsDataURL(assetIcon as File);
            }
          } else {
            // Fake icon
            setIconPreview(`https://i.wpfc.ml/35/8gtsxa.png`);
          }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params]);

  const updateRequestStatus = async (id: string, status: 'active' | 'rejected') => {
    if (!request) return;

    try {
        const response = await fetch(`/api/assets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update request');

        toast({
            title: `Request ${status === 'active' ? 'Approved' : 'Rejected'}`,
            description: `The asset "${request.assetName}" has been updated.`
        });
        router.push('/requests');

    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not update the request.'
        });
    }
  };

  const handleSaveObservation = () => {
    const observationText = (document.getElementById('observation') as HTMLTextAreaElement)?.value;
    if (!observationText?.trim()) {
        toast({
            variant: "destructive",
            title: "Observation is empty",
            description: "Please write an observation before saving.",
        });
        return;
    }
    // In a real app, you would save this observation to your backend.
    toast({
        title: "Observation Saved",
        description: `Your observation for "${request?.assetName}" has been noted.`,
    });
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));


  if (loading) {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <p>Loading request details...</p>
        </div>
    );
  }

  if (!request) {
    notFound();
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-dvh">
          <HeaderDynamic />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/requests"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold">
                    Asset Request Review
                </h1>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
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

              {currentStep === 1 && (
                <ReviewSection title="Asset Information">
                    <ReviewRow icon={Info} label="Asset Name" value={request.assetName} />
                    <ReviewRow icon={Tag} label="Asset Ticker" value={request.assetTicker} />
                    <ReviewRow icon={ImageIcon} label="Asset Icon" value={
                      iconPreview ? (
                          <Avatar className="h-6 w-6">
                              <AvatarImage src={iconPreview} alt="Asset Icon Preview" />
                              <AvatarFallback>{request.assetTicker.charAt(0)}</AvatarFallback>
                          </Avatar>
                      ) : <span className="text-muted-foreground">Not provided</span>
                    } />
                    <ReviewRow icon={HardDrive} label="Destination Address" value={<span className="font-mono">{request.destinationAddress}</span>} />
                </ReviewSection>
              )}

              {currentStep === 2 && (
                <ReviewSection title="Asset Details">
                    <ReviewRow icon={Hash} label="Decimals" value={request.decimals} />
                    <ReviewRow icon={Hash} label="Max Supply" value={request.maxSupply.toLocaleString()} />
                    <ReviewRow icon={ToggleRight} label="Is Freezable" value={request.isFreezable ? 'Yes' : 'No'} />
                     <ReviewRow icon={Network} label="Network" value={networkMap[request.network] || request.network} />
                </ReviewSection>
              )}

              {currentStep === 3 && (
                <ReviewSection title="Documents">
                    <ReviewRow icon={FileText} label="Whitepaper" value={<FilePreview file={request.whitepaper} fileName={`${request.assetTicker}_Whitepaper.pdf`} />} />
                    <ReviewRow icon={FileText} label="Legal Assetization Doc" value={<FilePreview file={request.legalAssetizationDoc} fileName="Legal_Assetization.pdf" />} />
                    <ReviewRow icon={FileText} label="Asset Issuance Legal Doc" value={<FilePreview file={request.assetIssuanceLegalDoc} fileName="Asset_Issuance_Agreement.pdf" />} />
                </ReviewSection>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  {request.issuer && (
                    <ReviewSection title="Issuer Information">
                        <ReviewRow icon={User} label="Issuer Name" value={request.issuer.name} />
                        <ReviewRow icon={Info} label="Issuer Email" value={request.issuer.email} />
                        <ReviewRow icon={HardDrive} label="Issuer Wallet" value={<span className="font-mono">{request.issuer.walletAddress}</span>} />
                    </ReviewSection>
                  )}

                  {request.status === 'pending' && (
                    <Card>
                      <CardHeader>
                          <CardTitle>Actions</CardTitle>
                          <CardDescription>Approve or reject this asset issuance request. You can add an optional observation.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                           <div className="space-y-2">
                              <Label htmlFor="observation">Observation</Label>
                              <Textarea id="observation" placeholder="Add an observation for the issuer..." />
                          </div>
                          <Button variant="secondary" className="w-full" onClick={handleSaveObservation}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Leave Observation
                          </Button>
                          <div className="flex flex-col sm:flex-row gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" className="w-full">
                                    <X className="mr-2 h-4 w-4" /> Reject Request
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will reject the asset request for &quot;{request.assetName}&quot;. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => updateRequestStatus(request.id, 'rejected')}>Confirm Reject</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Button className="w-full" onClick={() => updateRequestStatus(request.id, 'active')}>
                                  <Check className="mr-2 h-4 w-4" /> Approve Request
                              </Button>
                          </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

                <CardFooter className="justify-between px-0">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    Back
                    </Button>
                    <Button onClick={handleNext} disabled={currentStep === steps.length}>
                    Next
                    </Button>
                </CardFooter>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RequestDetailsUsePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <RequestDetailsPage params={resolvedParams} />;
}
