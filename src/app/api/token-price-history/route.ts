import { NextResponse } from 'next/server';
import { z } from 'zod';

const tokenPriceHistory = [
  { month: 'Jan', price: 68.5 },
  { month: 'Feb', price: 72.3 },
  { month: 'Mar', price: 80.1 },
  { month: 'Apr', price: 75.6 },
  { month: 'May', price: 85.4 },
  { month: 'Jun', price: 92.2 },
  { month: 'Jul', price: 88.9 },
];

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage } = validation.data;
  
  const total = tokenPriceHistory.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = tokenPriceHistory.slice(startIndex, startIndex + perPage);

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
