import { NextResponse } from 'next/server';
import type { Issuer } from '@/lib/types';

const issuersData: Issuer[] = [
    {
        id: 'iss-001',
        name: 'Prime Issuance',
        email: 'contact@primeissuance.com',
        walletAddress: 'spark1q...iss1pr',
        issuedTokens: 5,
        pendingTokens: 2,
        status: 'active',
    },
    {
        id: 'iss-002',
        name: 'TokenForge',
        email: 'support@tokenforge.io',
        walletAddress: 'spark1q...iss2tf',
        issuedTokens: 12,
        pendingTokens: 0,
        status: 'active',
    },
    {
        id: 'iss-003',
        name: 'Digital Assets Inc.',
        email: 'admin@digitalassets.com',
        walletAddress: 'spark1q...iss3da',
        issuedTokens: 2,
        pendingTokens: 1,
        status: 'inactive',
    },
];

export async function GET() {
  return NextResponse.json(issuersData);
}
