'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardFooter, CardDescription } from '../ui/card';
import { Switch } from '../ui/switch';
import Image from 'next/image';
import type { Company } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const providers = [
  { name: 'Didit', logo: 'https://i.ibb.co/XrPTRgRf/Dise-o-sin-t-tulo-15.png', description: 'Verify user identities with Didit.' },
  { name: 'Sumsub', logo: 'https://i.ibb.co/xKGcFvcs/1.png', description: 'All-in-one verification platform.' },
  { name: 'Onfido', logo: 'https://i.ibb.co/8g2Qmknh/2.png', description: 'AI-powered identity verification.' },
  { name: 'Veriff', logo: 'https://i.ibb.co/JW2JLXp6/3.png', description: 'Secure and scalable identity verification.' },
  { name: 'Persona', logo: 'https://i.ibb.co/xkfbNB6/6.png', description: 'Identity infrastructure for businesses.' },
];

function ProviderCard({ name, logo, description, isConnected, onToggle }: { name: string; logo: string; description: string; isConnected: boolean; onToggle: (checked: boolean) => void; }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="40px"
                className="rounded-md"
              />
            </div>
            <CardTitle className="text-lg">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-green-500">
              Connected
            </span>
            <Switch checked={isConnected} onCheckedChange={onToggle} />
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => onToggle(true)}>
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


export default function KycProviderList() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const selectedCompanyId = localStorage.getItem('selectedCompanyId');
    if(selectedCompanyId) {
      setLoading(true);
      fetch(`/api/companies/${selectedCompanyId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setCompany(data);
        }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleToggle = async (providerName: string, checked: boolean) => {
    if (!company) {
      toast({ variant: 'destructive', title: 'Error', description: 'No company selected.' });
      return;
    };

    let updatedProviders: string[];
    if (checked) {
        updatedProviders = [...(company.complianceProviders || []), providerName];
    } else {
        updatedProviders = (company.complianceProviders || []).filter(p => p !== providerName);
    }
    
    const response = await fetch(`/api/companies/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complianceProviders: updatedProviders }),
    });
    
    if (response.ok) {
        const updatedCompany = await response.json();
        setCompany(updatedCompany);
        window.dispatchEvent(new Event('companyChanged'));
        toast({ title: 'Providers updated' });
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update providers.' });
    }
  };
  
  if (loading) return <p>Loading providers...</p>

  const connectedProviders = company?.complianceProviders || [];
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your identity verification.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <ProviderCard 
            key={provider.name} 
            {...provider}
            isConnected={connectedProviders.includes(provider.name)}
            onToggle={(checked) => handleToggle(provider.name, checked)}
          />
        ))}
      </div>
    </div>
  );
}
