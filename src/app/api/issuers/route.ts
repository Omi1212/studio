import { NextResponse } from 'next/server';
import { issuersData } from './data';
import type { Issuer } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
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
  const startIndex = (page - 1) * limit;
  const paginatedIssuers = filteredIssuers.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    issuers: paginatedIssuers,
    total,
  });
}

export async function POST(request: Request) {
  const newIssuerData = await request.json();
  const newIssuer: Issuer = {
    ...newIssuerData,
    id: `iss-${Math.random().toString(36).substring(2, 9)}`,
  };
  issuersData.unshift(newIssuer);
  return NextResponse.json(newIssuer, { status: 201 });
}
