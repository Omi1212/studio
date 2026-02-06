import { NextResponse } from 'next/server';
import { usersData } from './data';
import type { User } from '@/lib/types';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    walletAddress: z.string().min(1, { message: "Wallet address is required" }),
    role: z.enum(['investor', 'issuer', 'agent', 'superadmin']),
    kycStatus: z.enum(['verified', 'pending', 'rejected']),
    status: z.enum(['active', 'inactive']),
});

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
    try {
        const body = await request.json();
        const newUser = userSchema.parse(body);

        const userWithId: User = {
            ...newUser,
            id: `user-${Math.random().toString(36).substring(2, 9)}`,
        };
        usersData.unshift(userWithId);
        return NextResponse.json(userWithId, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
