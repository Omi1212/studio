import { NextResponse } from 'next/server';
import { usersData } from './data';
import type { User } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const query = searchParams.get('query');

  let filteredUsers = usersData;

  if (role && role !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  if (status && status !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(lowercasedQuery) ||
      user.email.toLowerCase().includes(lowercasedQuery) ||
      user.walletAddress.toLowerCase().includes(lowercasedQuery)
    );
  }

  const total = filteredUsers.length;
  const startIndex = (page - 1) * perPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    users: paginatedUsers,
    total,
  });
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
