import { NextResponse } from 'next/server';

const paymentData = [
  { month: 'January', income: 18600, expense: 8000 },
  { month: 'February', income: 30500, expense: 12000 },
  { month: 'March', income: 23700, expense: 18000 },
  { month: 'April', income: 27800, expense: 11000 },
  { month: 'May', income: 18900, expense: 15000 },
  { month: 'June', income: 23900, expense: 17000 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  
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
