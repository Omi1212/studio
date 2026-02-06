import { NextResponse } from 'next/server';
import { issuersData } from './data';
import type { Issuer } from '@/lib/types';
import { z } from 'zod';

const issuerSchema = z.object({
  name: z.string().min(1, 'Issuer Name is required'),
  email: z.string().email('Invalid email address'),
  walletAddress: z.string().min(1, 'Wallet address is required'),
  issuedTokens: z.number().int().nonnegative(),
  pendingTokens: z.number().int().nonnegative(),
  status: z.enum(['active', 'inactive']),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const status = searchParams.get('status');
  const query = searchParams.get('query');

  let filteredIssuers = issuersData;

  if (status && status !== 'all') {
    filteredIssuers = filteredIssuers.filter(issuer => issuer.status === status);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredIssuers = filteredIssuers.filter(issuer =>
      issuer.name.toLowerCase().includes(lowercasedQuery) ||
      issuer.email.toLowerCase().includes(lowercasedQuery) ||
      issuer.walletAddress.toLowerCase().includes(lowercasedQuery)
    );
  }

  const total = filteredIssuers.length;
  const startIndex = (page - 1) * perPage;
  const paginatedIssuers = filteredIssuers.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    issuers: paginatedIssuers,
    total,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newIssuerData = issuerSchema.parse(body);

    const newIssuer: Issuer = {
      ...newIssuerData,
      id: `iss-${Math.random().toString(36).substring(2, 9)}`,
    };
    issuersData.unshift(newIssuer);
    return NextResponse.json(newIssuer, { status: 201 });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return NextResponse.json({ errors: error.errors }, { status: 400 });
      }
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
