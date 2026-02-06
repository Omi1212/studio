import { NextResponse } from 'next/server';
import { z } from 'zod';

const volumeData = [
  {
    title: "Today's Volume",
    value: '25,320',
    change: 2.5,
  },
  {
    title: 'Yesterday',
    value: '22,180',
    change: -1.8,
  },
  {
    title: 'Last 7 Days',
    value: '180,950',
    change: 12.1,
  },
  {
    title: 'Last 30 Days',
    value: '750,430',
    change: 7.2,
  },
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
  
  const total = volumeData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = volumeData.slice(startIndex, startIndex + perPage);

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
