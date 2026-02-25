
import { NextResponse } from 'next/server';
import { invitationsData } from './data';
import type { Invitation } from '@/lib/types';
import { z } from 'zod';

const postSchema = z.object({
  email: z.string().email(),
  role: z.enum(['Admin', 'Operations', 'Sales', 'Technical Support']),
  companyId: z.string(),
  companyName: z.string(),
  inviterName: z.string(),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    
    if (companyId) {
        const companyInvitations = invitationsData.filter(inv => inv.companyId === companyId && inv.status === 'pending');
        return NextResponse.json(companyInvitations);
    }

    return NextResponse.json(invitationsData);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newInvitationData = postSchema.parse(body);

        // Check if invitation already exists
        const existing = invitationsData.find(inv => inv.email === newInvitationData.email && inv.companyId === newInvitationData.companyId && inv.status === 'pending');
        if (existing) {
            return NextResponse.json({ message: 'An invitation has already been sent to this email address for this company.' }, { status: 409 });
        }

        const newInvitation: Invitation = {
            ...newInvitationData,
            id: `inv-${Date.now()}`,
            status: 'pending'
        };

        invitationsData.unshift(newInvitation);
        return NextResponse.json(newInvitation, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        console.error('POST /api/invitations error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
