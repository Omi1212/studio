'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardFooter, CardDescription } from '../ui/card';
import { Switch } from '../ui/switch';
import Image from 'next/image';

const kytProviders = [
  { name: 'Scorechain', logo: 'https://i.ibb.co/hFk9xwJW/11.png', description: 'Cryptocurrency transaction monitoring.' },
  { name: 'Crystal Intelligence', logo: 'https://i.ibb.co/jv0cDR9Z/12.png', description: 'Blockchain analytics and AML compliance.' },
  { name: 'Chainalysis', logo: 'https://i.ibb.co/ZRBJWJ5T/13.png', description: 'The blockchain data platform.' },
  { name: 'TRM Labs', logo: 'https://i.ibb.co/zhRZJDbW/14.png', description: 'Monitor, detect, and investigate crypto fraud.' },
  { name: 'Merkle Science', logo: 'https://i.ibb.co/dZddJQ2/merkle-science.png', description: 'Predictive crypto risk intelligence.' },
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

export default function KytProviderList() {
    const [connectedProviders, setConnectedProviders] = useState<string[]>([]);

    useEffect(() => {
        const connected = [];
        for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('compliance-provider-')) {
            connected.push(key.replace('compliance-provider-', ''));
        }
        }
        setConnectedProviders(connected);
    }, []);

    const handleToggle = (providerName: string, checked: boolean) => {
        const storageKey = `compliance-provider-${providerName}`;
        if (checked) {
            localStorage.setItem(storageKey, 'true');
            setConnectedProviders(prev => [...prev, providerName]);
        } else {
            localStorage.removeItem(storageKey);
            setConnectedProviders(prev => prev.filter(p => p !== providerName));
        }
        window.dispatchEvent(new Event('complianceProvidersChanged'));
    };
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your transaction monitoring.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kytProviders.map((provider) => (
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
