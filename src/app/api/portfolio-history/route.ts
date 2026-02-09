import { NextResponse } from 'next/server';
import { z } from 'zod';

const portfolioHistoryData = [
  { date: '2024-07-01', value: 25000 },
  { date: '2024-07-05', value: 28510 },
  { date: '2024-07-10', value: 27900 },
  { date: '2024-07-15', value: 25880 },
  { date: '2024-07-20', value: 31180 },
  { date: '2024-07-25', value: 32750 },
  { date: '2024-07-30', value: 32750 },
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
  
  const total = portfolioHistoryData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = portfolioHistoryData.slice(startIndex, startIndex + perPage);

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
