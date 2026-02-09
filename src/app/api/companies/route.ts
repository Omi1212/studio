import { NextResponse } from 'next/server';
import { z } from 'zod';

const companiesData = [
  { id: 'bstratus-securities', name: 'Bstratus Securities' },
  { id: 'neobank-sa-de-cv', name: 'NeoBank SA de CV' },
  { id: 'tradfi-bank-sa', name: 'TradFi Bank SA' },
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
  
  const total = companiesData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = companiesData.slice(startIndex, startIndex + perPage);

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
