import { NextResponse } from 'next/server';
import { usersData } from './data';
import type { User } from '@/lib/types';

export async function GET() {
  return NextResponse.json(usersData);
}

export async function POST(request: Request) {
  const newUser = await request.json();
  const userWithId: User = {
    ...newUser,
    id: `user-${Math.random().toString(36).substring(2, 9)}`,
  };
  usersData.unshift(userWithId);
  return NextResponse.json(userWithId, { status: 201 });
}
