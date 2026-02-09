import { NextResponse } from 'next/server';
import { transfersData } from './data';
import { z } from 'zod';

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
    type: z.enum(['Transfer', 'Mint', 'Burn', 'all']).optional(),
    query: z.string().optional(),
    tokenTicker: z.string().optional(),
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }
  
  const { page, perPage, type, query, tokenTicker } = validation.data;

  let filteredTransfers = transfersData;

  if (tokenTicker) {
      filteredTransfers = filteredTransfers.filter(t => t.tokenTicker === tokenTicker);
  }

  if (type && type !== 'all') {
    filteredTransfers = filteredTransfers.filter(t => t.type === type);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredTransfers = filteredTransfers.filter(t =>
      t.from.toLowerCase().includes(lowercasedQuery) ||
      t.to.toLowerCase().includes(lowercasedQuery)
    );
  }

  const total = filteredTransfers.length;
  const startIndex = (page - 1) * perPage;
  const paginatedTransfers = filteredTransfers.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedTransfers,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}
