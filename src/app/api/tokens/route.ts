import { NextResponse } from 'next/server';
import type { TokenDetails } from '@/lib/types';

const exampleTokens: Omit<TokenDetails, 'tokenIcon' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'>[] = [
  {
    id: 'example-1',
    tokenName: 'Digital Dollar',
    tokenTicker: 'DUSD',
    status: 'active' as const,
    network: 'spark',
    maxSupply: 100000000,
    price: 1.00,
    decimals: 2,
    isFreezable: true,
    issuerId: 'iss-001',
    destinationAddress: 'spark1q...iss1pr',
  },
  {
    id: 'example-2',
    tokenName: 'Gold Token',
    tokenTicker: 'GLDT',
    status: 'active' as const,
    network: 'spark',
    maxSupply: 21000000,
    price: 75.50,
    decimals: 8,
    isFreezable: false,
    issuerId: 'iss-002',
    destinationAddress: 'spark1q...iss2tf',
  },
  {
    id: 'example-3',
    tokenName: 'Real Estate Share',
    tokenTicker: 'REIT',
    status: 'pending' as const,
    network: 'rgb',
    maxSupply: 100000,
    price: 250.00,
    decimals: 0,
    isFreezable: true,
    issuerId: 'iss-001',
    destinationAddress: 'spark1q...iss1pr',
  },
  {
    id: 'example-4',
    tokenName: 'Carbon Credit',
    tokenTicker: 'CRBN',
    status: 'active' as const,
    network: 'rgb',
    maxSupply: 50000000,
    price: 12.75,
    decimals: 6,
    isFreezable: true,
    issuerId: 'iss-003',
    destinationAddress: 'spark1q...iss3da',
  },
];

export async function GET() {
  return NextResponse.json(exampleTokens);
}
