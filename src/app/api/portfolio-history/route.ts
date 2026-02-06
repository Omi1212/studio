import { NextResponse } from 'next/server';

const portfolioHistoryData = [
  { date: '2024-07-01', value: 25000 },
  { date: '2024-07-05', value: 28510 },
  { date: '2024-07-10', value: 27900 },
  { date: '2024-07-15', value: 25880 },
  { date: '2024-07-20', value: 31180 },
  { date: '2024-07-25', value: 32750 },
  { date: '2024-07-30', value: 32750 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  
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
