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

export async function GET() {
  return NextResponse.json(tokenPriceHistory);
}
