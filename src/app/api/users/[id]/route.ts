import { NextResponse } from 'next/server';
import { usersData } from '../data';
import { z } from 'zod';
import { companiesData } from '../../companies/data';

const patchSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  walletAddress: z.string().min(1, { message: "Wallet address is required" }).optional(),
  role: z.enum(['investor', 'issuer', 'agent', 'superadmin']).optional(),
  kycStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
  kybStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
  kytStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  phone: z.string().optional(),
  kycLevel: z.number().int().optional(),
  kybLevel: z.number().int().optional(),
  kytLevel: z.number().int().optional(),
  country: z.string().optional(),
  legalName: z.string().optional(),
  dob: z.string().optional(),
  idDoc: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
}).partial();

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
  try {
    const userIndex = usersData.findIndex((u) => u.id === params.id);
    if (userIndex === -1) {
      return new Response('User not found', { status: 404 });
    }

    const body = await request.json();
    const validatedData = patchSchema.parse(body);

    if (validatedData.businessName && !companiesData.some(c => c.name === validatedData.businessName)) {
        const newCompany = {
            id: validatedData.businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            name: validatedData.businessName,
        };
        companiesData.push(newCompany);
    }

    usersData[userIndex] = { ...usersData[userIndex], ...validatedData };

    return NextResponse.json(usersData[userIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
