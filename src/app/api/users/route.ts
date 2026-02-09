import { NextResponse } from 'next/server';
import { usersData } from './data';
import type { User } from '@/lib/types';
import { z } from 'zod';

const userPostSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    walletAddress: z.string().min(1, { message: "Wallet address is required" }),
    role: z.enum(['investor', 'issuer', 'agent', 'superadmin']),
    kycStatus: z.enum(['verified', 'pending', 'rejected']),
    status: z.enum(['active', 'inactive']),
});

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
    role: z.enum(['investor', 'issuer', 'agent', 'superadmin', 'all']).optional(),
    status: z.enum(['active', 'inactive', 'all']).optional(),
    query: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage, role, status, query } = validation.data;

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
    data: paginatedUsers,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newUser = userPostSchema.parse(body);

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
