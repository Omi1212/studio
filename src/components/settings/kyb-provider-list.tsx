'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardFooter, CardDescription } from '../ui/card';
import { Switch } from '../ui/switch';
import Image from 'next/image';

const kybProviders = [
  { name: 'Sumsub', logo: 'https://i.ibb.co/xKGcFvcs/1.png', description: 'All-in-one verification platform.' },
  { name: 'Onfido', logo: 'https://i.ibb.co/8g2Qmknh/2.png', description: 'AI-powered identity verification.' },
  { name: 'Kyckr', logo: 'https://i.ibb.co/0yYWB1Yb/8.png', description: 'Real-time company registry data.' },
  { name: 'Middesk', logo: 'https://i.ibb.co/8DsyxCyR/9.png', description: 'Business verification and compliance.' },
  { name: "Moody's Analytics", logo: 'https://i.ibb.co/Pzc00sHp/10.png', description: 'Comprehensive risk assessment.' },
];

function ProviderCard({ name, logo, description }: { name: string; logo: string; description: string; }) {
  const [isConnected, setIsConnected] = useState(false);

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
            <Switch checked={isConnected} onCheckedChange={setIsConnected} />
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setIsConnected(true)}>
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function KybProviderList() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your business verification.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kybProviders.map((provider) => (
          <ProviderCard key={provider.name} {...provider} />
        ))}
      </div>
    </div>
  );
}
