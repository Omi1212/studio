'use client';

import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardTitle } from '../ui/card';
import Image from 'next/image';

const providers = [
  { name: 'Sumsub', logo: 'https://i.wpfc.ml/35/sumsub.svg' },
  { name: 'Onfido', logo: 'https://i.wpfc.ml/35/onfido.svg' },
  { name: 'Veriff', logo: 'https://i.wpfc.ml/35/veriff.svg' },
  { name: 'Shufti Pro', logo: 'https://i.wpfc.ml/35/shuftipro.svg' },
  { name: 'Jumio', logo: 'https://i.wpfc.ml/35/jumio.svg' },
  { name: 'Persona', logo: 'https://i.wpfc.ml/35/persona.svg' },
  { name: 'Trulioo', logo: 'https://i.wpfc.ml/35/trulioo.svg' },
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <Card
            key={provider.name}
            className="flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors group"
          >
            <div className="relative h-10 w-24 mb-3">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
              />
            </div>
            <CardTitle className="text-sm font-medium">{provider.name}</CardTitle>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="link" onClick={onViewStatus} className="text-muted-foreground">
          <ShieldCheck className="mr-2 h-4 w-4" /> View Verification Status
        </Button>
      </div>
    </div>
  );
}
