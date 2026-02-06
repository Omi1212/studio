import { NextResponse } from 'next/server';
import { usersData } from '../data';

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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userIndex = usersData.findIndex((u) => u.id === params.id);
  if (userIndex === -1) {
    return new Response('User not found', { status: 404 });
  }

  const body = await request.json();
  usersData[userIndex] = { ...usersData[userIndex], ...body };

  return NextResponse.json(usersData[userIndex]);
}
