import { NextResponse } from 'next/server';
import { z } from 'zod';

const cryptoData = [
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    balance: 0,
    value: 0.00,
    icon: 'btc',
    isToken: false,
  },
  {
    ticker: 'JMT',
    name: 'MoisesToken',
    balance: 2500,
    value: 0.00,
    icon: null,
    isToken: true,
  },
  {
    ticker: 'OMI',
    name: 'Omar',
    balance: 10000,
    value: 0.00,
    icon: null,
    isToken: true,
  },
];

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }
  
  const { page, perPage } = validation.data;
  
  const total = cryptoData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = cryptoData.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedData,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}
