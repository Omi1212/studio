import { NextResponse } from 'next/server';
import { exampleTokens } from './data';
import type { TokenDetails } from '@/lib/types';
import { z } from 'zod';

const tokenPostSchema = z.object({
  tokenName: z.string().min(1),
  tokenTicker: z.string().min(1).max(5),
  destinationAddress: z.string().min(1),
  decimals: z.number().int().min(0).max(18),
  maxSupply: z.number().positive(),
  isFreezable: z.boolean(),
  network: z.string().min(1),
  status: z.enum(['pending', 'active', 'frozen', 'draft']),
  issuerId: z.string().optional()
});

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
    status: z.enum(['pending', 'active', 'frozen', 'draft', 'all']).optional(),
    query: z.string().optional(),
    excludeStatus: z.string().optional(),
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage, status, query, excludeStatus } = validation.data;

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
  const startIndex = (page - 1) * perPage;
  const paginatedTokens = filteredTokens.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedTokens,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // We don't validate file-related fields here as they are not sent in the JSON body
        const newTokenData = tokenPostSchema.parse(body);

        const newToken: Omit<TokenDetails, 'tokenIcon' | 'whitepaper' | 'legalTokenizationDoc' | 'tokenIssuanceLegalDoc' | 'publicKey'> = {
            ...newTokenData,
            id: `btkn1...${Math.random().toString(36).substring(2, 10)}`, // Simulate new ID
        };
        (exampleTokens as any[]).unshift(newToken);
        return NextResponse.json(newToken, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
