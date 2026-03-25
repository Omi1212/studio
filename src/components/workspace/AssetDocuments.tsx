'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Upload } from 'lucide-react';
import type { AssetDetails } from '@/lib/types';

function FileRow({ label, file, fileName }: { label: string, file: any, fileName: string }) {
    const hasFile = file && (file instanceof File || (typeof file === 'object' && 'name' in file));
    
    const fileUrl = hasFile ? URL.createObjectURL(file as File) : '#';

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div>
                    <p className="font-semibold">{label}</p>
                    {hasFile ? (
                        <p className="text-sm text-muted-foreground" title={fileName}>{fileName}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">Not provided</p>
                    )}
                </div>
            </div>
            {hasFile ? (
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" title="View">
                            <Eye className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={fileUrl} download={fileName} title="Download">
                            <Download className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            ) : (
                <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                </Button>
            )}
        </div>
    );
}


export default function AssetDocuments({ asset }: { asset: AssetDetails }) {
    const whitepaperFile = asset.whitepaper?.[0];
    const legalDocFile = asset.legalAssetizationDoc?.[0];
    const issuanceDocFile = asset.assetIssuanceLegalDoc?.[0];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>View and manage the asset's legal and informational documents.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    <FileRow label="Whitepaper" file={whitepaperFile} fileName={whitepaperFile?.name || `${asset.assetTicker}_Whitepaper.pdf`} />
                    <FileRow label="Legal Assetization Document" file={legalDocFile} fileName={legalDocFile?.name || 'Legal_Assetization.pdf'}/>
                    <FileRow label="Asset Issuance Legal Document" file={issuanceDocFile} fileName={issuanceDocFile?.name || 'Asset_Issuance_Agreement.pdf'} />
                </div>
            </CardContent>
        </Card>
    );
}
