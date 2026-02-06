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

export async function GET() {
  return NextResponse.json(portfolioHistoryData);
}
