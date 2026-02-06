import { NextResponse } from 'next/server';
import { z } from 'zod';

const paymentData = [
  { month: 'January', income: 18600, expense: 8000 },
  { month: 'February', income: 30500, expense: 12000 },
  { month: 'March', income: 23700, expense: 18000 },
  { month: 'April', income: 27800, expense: 11000 },
  { month: 'May', income: 18900, expense: 15000 },
  { month: 'June', income: 23900, expense: 17000 },
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
  
  const total = paymentData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = paymentData.slice(startIndex, startIndex + perPage);

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
