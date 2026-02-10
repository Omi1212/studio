'use client';

import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardTitle } from '../ui/card';
import Image from 'next/image';

const providers = [
  { name: 'Sumsub', logo: 'https://i.ibb.co/xKGcFvcs/1.png' },
  { name: 'Onfido', logo: 'https://i.ibb.co/8g2Qmknh/2.png' },
  { name: 'Veriff', logo: 'https://i.ibb.co/JW2JLXp6/3.png' },
  { name: 'Shufti Pro', logo: 'https://i.ibb.co/bMT2x7YG/4.png' },
  { name: 'Jumio', logo: 'https://i.ibb.co/QFm6xmyM/5.png' },
  { name: 'Persona', logo: 'https://i.ibb.co/xkfbNB6/6.png' },
  { name: 'Trulioo', logo: 'https://i.ibb.co/pDLtKw4/7.png' },
];

interface KycProviderListProps {
  onViewStatus: () => void;
}

export default function KycProviderList({ onViewStatus }: KycProviderListProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground">
        Choose a provider to continue with your identity verification.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card
            key={provider.name}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors group rounded-xl"
          >
            <div className="relative h-12 w-28 mb-4">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="transition-all duration-300 rounded-md"
              />
            </div>
            <CardTitle className="text-base font-semibold">{provider.name}</CardTitle>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="link" onClick={onViewStatus} className="text-muted-foreground">
          <ShieldCheck className="mr-2 h-4 w-4" /> Use Platform Verification
        </Button>
      </div>
    </div>
  );
}
