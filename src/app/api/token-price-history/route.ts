import { NextResponse } from 'next/server';

const tokenPriceHistory = [
  { month: 'Jan', price: 68.5 },
  { month: 'Feb', price: 72.3 },
  { month: 'Mar', price: 80.1 },
  { month: 'Apr', price: 75.6 },
  { month: 'May', price: 85.4 },
  { month: 'Jun', price: 92.2 },
  { month: 'Jul', price: 88.9 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  
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
