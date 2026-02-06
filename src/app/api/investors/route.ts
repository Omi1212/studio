import { NextResponse } from 'next/server';
import { investorsData } from './data';
import type { User } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
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
  const startIndex = (page - 1) * limit;
  const paginatedInvestors = filteredInvestors.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    investors: paginatedInvestors,
    total,
  });
}

export async function POST(request: Request) {
  const newInvestorData = await request.json();
  const newUser: User = {
    ...newInvestorData,
    id: `inv-${Math.random().toString(36).substring(2, 9)}`,
  };
  investorsData.unshift(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
