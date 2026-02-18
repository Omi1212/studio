import { NextResponse } from 'next/server';
import { z } from 'zod';
import { companiesData } from '../data';

const patchSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  legalName: z.string().optional(),
  address: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  employeeRange: z.string().optional(),
  countryOfJurisdiction: z.string().optional(),
  kybLevel: z.number().int().optional(),
  kybStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
}).partial();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const company = companiesData.find((c) => c.id === params.id);
  if (company) {
    return NextResponse.json(company);
  }
  return new Response('Company not found', { status: 404 });
}


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyIndex = companiesData.findIndex((c) => c.id === params.id);
    if (companyIndex === -1) {
      return new Response('Company not found', { status: 404 });
    }

    const body = await request.json();
    const validatedData = patchSchema.parse(body);

    companiesData[companyIndex] = { ...companiesData[companyIndex], ...validatedData };

    return NextResponse.json(companiesData[companyIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error('PATCH /api/companies/[id] error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
