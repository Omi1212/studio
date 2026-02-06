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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const status = searchParams.get('status'); // For investor-list (frozen/whitelisted)
  const kycStatus = searchParams.get('kycStatus'); // For whitelisting-requests
  const query = searchParams.get('query');
  const tokenId = searchParams.get('tokenId');
  const onlyVerified = searchParams.get('onlyVerified');

  let filteredInvestors: User[] = investorsData;

  if (onlyVerified === 'true') {
    filteredInvestors = filteredInvestors.filter(investor => investor.kycStatus === 'verified');
  }
  
  if (tokenId) {
    filteredInvestors = filteredInvestors.filter(investor => 
        investor.transactions?.some(tx => tx.token.id === tokenId)
    );
  }

  if (kycStatus) {
    filteredInvestors = filteredInvestors.filter(investor => investor.kycStatus === kycStatus);
  }

  if (status) {
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
