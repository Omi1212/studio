
import { NextResponse } from 'next/server';
import { investorsData } from './data';
import type { User } from '@/lib/types';
import { z } from 'zod';

const investorPostSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  walletAddress: z.string().min(1, { message: "Wallet address is required" }),
  kycStatus: z.enum(['verified', 'pending']),
  role: z.literal('investor'),
  joinedDate: z.string(),
  totalInvested: z.number(),
  holdings: z.array(z.any()),
  transactions: z.array(z.any()),
  isFrozen: z.boolean(),
});

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
    status: z.enum(['frozen', 'whitelisted', 'all']).optional(),
    kycStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
    query: z.string().optional(),
    assetId: z.string().optional(),
    onlyVerified: z.string().optional(),
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage, status, kycStatus, query, assetId, onlyVerified } = validation.data;

  let filteredInvestors: User[] = investorsData;

  if (onlyVerified === 'true') {
    filteredInvestors = filteredInvestors.filter(investor => investor.kycStatus === 'verified');
  }
  
  if (assetId) {
    filteredInvestors = filteredInvestors.filter(investor => 
        investor.holdings?.some(holding => holding.assetId === assetId)
    );
  }

  if (kycStatus) {
    filteredInvestors = filteredInvestors.filter(investor => investor.kycStatus === kycStatus);
  }

  if (status && status !== 'all') {
    filteredInvestors = filteredInvestors.filter(inv => {
        if (status === 'frozen') return inv.isFrozen;
        if (status === 'whitelisted') return !inv.isFrozen;
        return true;
    });
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredInvestors = filteredInvestors.filter(inv => 
      inv.name.toLowerCase().includes(lowercasedQuery) ||
      inv.email.toLowerCase().includes(lowercasedQuery) ||
      inv.walletAddress.toLowerCase().includes(lowercasedQuery)
    );
  }
  
  const total = filteredInvestors.length;
  const startIndex = (page - 1) * perPage;
  const paginatedInvestors = filteredInvestors.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedInvestors,
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
    const newInvestorData = investorPostSchema.parse(body);

    const newUser: User = {
      ...newInvestorData,
      id: `inv-${Math.random().toString(36).substring(2, 9)}`,
      status: 'active',
    };
    investorsData.unshift(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
