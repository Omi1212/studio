import { NextResponse } from 'next/server';
import { exampleTokens } from './data';
import type { TokenDetails } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const status = searchParams.get('status');
  const query = searchParams.get('query');
  const excludeStatus = searchParams.get('excludeStatus');

  let filteredTokens = exampleTokens;

  if (excludeStatus) {
    filteredTokens = filteredTokens.filter(token => token.status !== excludeStatus);
  }

  if (status && status !== 'all') {
    filteredTokens = filteredTokens.filter(token => token.status === status);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredTokens = filteredTokens.filter(token =>
        (token.tokenName || '').toLowerCase().includes(lowercasedQuery) ||
        (token.tokenTicker || '').toLowerCase().includes(lowercasedQuery)
    );
  }
  
  const total = filteredTokens.length;
  const startIndex = (page - 1) * limit;
  const paginatedTokens = filteredTokens.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    tokens: paginatedTokens,
    total,
  });
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
