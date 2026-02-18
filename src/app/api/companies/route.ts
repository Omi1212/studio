import { NextResponse } from 'next/server';
import { z } from 'zod';
import { companiesData } from './data';
import type { Company } from '@/lib/types';

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(1000).default(10),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
  }

  const { page, perPage } = validation.data;
  
  const total = companiesData.length;
  const startIndex = (page - 1) * perPage;
  const paginatedData = companiesData.slice(startIndex, startIndex + perPage);

  return NextResponse.json({
    data: paginatedData,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
}

const companyPostSchema = z.object({
    name: z.string().min(1, "Company name is required"),
    legalName: z.string().optional(),
    industry: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    employeeRange: z.string().optional(),
    countryOfJurisdiction: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newCompanyData = companyPostSchema.parse(body);

        let newId = newCompanyData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Check for ID collision and append random string if needed
        if (companiesData.some(c => c.id === newId)) {
            newId = `${newId}-${Math.random().toString(36).substring(2, 7)}`;
        }
        
        const newCompany: Company = {
            ...newCompanyData,
            id: newId,
            registrationId: `${newCompanyData.name.substring(0, 2).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            kybStatus: 'pending',
            kybLevel: 0,
        };


        companiesData.unshift(newCompany);
        return NextResponse.json(newCompany, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        console.error('POST /api/companies error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
