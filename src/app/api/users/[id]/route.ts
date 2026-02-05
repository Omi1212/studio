import { NextResponse } from 'next/server';
import { usersData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = usersData.find((u) => u.id === params.id);
  if (user) {
    return NextResponse.json(user);
  }
  return new Response('User not found', { status: 404 });
}
