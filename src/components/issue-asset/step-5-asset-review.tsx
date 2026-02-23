'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { AssetFormValues } from './issue-asset-form';
import { useState, useEffect } from 'react';
import { FileText, HardDrive, Hash, Image as ImageIcon, Info, Loader2, Network, Tag, ToggleRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Step5ReviewProps {
  onSubmit: (data: Partial<AssetFormValues>) => void;
  onBack: () => void;
  onSaveDraft: (data: Partial<AssetFormValues>) => void;
  formData: AssetFormValues;
}

function ReviewSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <h3 className="font-semibold text-base mb-4">{title}</h3>
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

function FilePreview({ fileList }: { fileList: FileList | File[] | null | undefined }) {
    if (!fileList || fileList.length === 0 || !fileList[0]) return <span className="text-muted-foreground">Not provided</span>;
    const file = fileList[0];
    return (
        <div className="flex items-center gap-2 text-sm justify-end">
            <span>{file.name}</span>
        </div>
    )
}

const assetTypes = [
    { value: 'security_token', label: 'Security Token' },
    { value: 'utility_token', label: 'Utility Token' },
    { value: 'stablecoin', label: 'Stablecoin' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' },
];


export default function Step5Review({ onSubmit, onBack, onSaveDraft, formData }: Step5ReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (formData.assetIcon && formData.assetIcon instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      }
      reader.readAsDataURL(formData.assetIcon);
    } else if (typeof formData.assetIcon === 'object' && formData.assetIcon && 'name' in formData.assetIcon) { // Handle File object from draft
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      }
      reader.readAsDataURL(formData.assetIcon as File);
    }
    else {
        setIconPreview(null);
    }
  }, [formData.assetIcon]);


  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit(formData);
    setIsSubmitting(false);
  };
  
  const networkMap: { [key: string]: string } = {
    spark: 'Spark Network',
    liquid: 'Liquid Network',
    rgb: 'RGB Protocol',
    taproot: 'Taproot Assets',
  };
  
  const assetTypeLabel = assetTypes.find(t => t.value === formData.assetType)?.label || formData.assetType;

  return (
    <Card>
        <CardHeader>
            <CardTitle>Review Your Asset</CardTitle>
            <CardDescription>Please review the details below before issuing the asset.</CardDescription>
        </CardHeader>
      <CardContent className="space-y-6">
        
        <ReviewSection title="Asset Information">
            <ReviewRow icon={Info} label="Asset Name" value={formData.assetName} />
            <ReviewRow icon={Tag} label="Asset Ticker" value={formData.assetTicker} />
            <ReviewRow icon={Info} label="Asset Type" value={assetTypeLabel} />
            <ReviewRow icon={ImageIcon} label="Asset Icon" value={
              iconPreview ? (
                  <Avatar className="h-6 w-6">
                      <AvatarImage src={iconPreview} alt="Asset Icon Preview" />
                      <AvatarFallback>{formData.assetTicker.charAt(0)}</AvatarFallback>
                  </Avatar>
              ) : <span className="text-muted-foreground">Not provided</span>
            } />
        </ReviewSection>

        <ReviewSection title="Asset Details">
            <ReviewRow icon={HardDrive} label="Destination Address" value={<span className="font-mono">{formData.destinationAddress}</span>} />
            <ReviewRow icon={Hash} label="Decimals" value={formData.decimals} />
            <ReviewRow icon={Hash} label="Max Supply" value={formData.maxSupply.toLocaleString()} />
            <ReviewRow icon={ToggleRight} label="Is Freezable" value={formData.isFreezable ? 'Yes' : 'No'} />
        </ReviewSection>
        
        <ReviewSection title="Documents">
            <ReviewRow icon={FileText} label="Whitepaper" value={<FilePreview fileList={formData.whitepaper as FileList | undefined} />} />
            <ReviewRow icon={FileText} label="Legal Assetization Doc" value={<FilePreview fileList={formData.legalAssetizationDoc as FileList | undefined} />} />
            <ReviewRow icon={FileText} label="Asset Issuance Legal Doc" value={<FilePreview fileList={formData.assetIssuanceLegalDoc as FileList | undefined} />} />
        </ReviewSection>
        
        <ReviewSection title="Network">
             <ReviewRow icon={Network} label="Network" value={networkMap[formData.network] || formData.network} />
        </ReviewSection>

      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
