import { NextResponse } from 'next/server';
import { exampleTokens } from './data';
import type { TokenDetails } from '@/lib/types';

export async function GET() {
  return NextResponse.json(exampleTokens);
}

export async function POST(request: Request) {
    const newTokenData = await request.json();
    const newToken: Omit<TokenDetails, 'tokenIcon' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'> = {
        ...newTokenData,
        id: `btkn1...${Math.random().toString(36).substring(2, 10)}`, // Simulate new ID
    };
    (exampleTokens as any[]).unshift(newToken);
    return NextResponse.json(newToken, { status: 201 });
}
