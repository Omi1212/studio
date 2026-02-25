
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { invitationsData } from '../data';
import { usersData } from '../../users/data';

const patchSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status } = patchSchema.parse(body);

        const invitationIndex = invitationsData.findIndex(inv => inv.id === params.id);
        if (invitationIndex === -1) {
            return new Response('Invitation not found', { status: 404 });
        }
        
        const invitation = invitationsData[invitationIndex];
        invitationsData[invitationIndex].status = status;

        if (status === 'accepted') {
            const userIndex = usersData.findIndex(u => u.email === invitation.email);
            if (userIndex !== -1) {
                const user = usersData[userIndex];
                if (!user.companyId?.includes(invitation.companyId)) {
                    user.companyId = [...(user.companyId || []), invitation.companyId];
                    if (!user.companyRoles) {
                        user.companyRoles = {};
                    }
                    user.companyRoles[invitation.companyId] = invitation.role;
                }
            } else {
                // This demo won't handle creating a new user from an invitation.
                // It assumes the invited user already exists on the platform.
            }
        }
        
        return NextResponse.json(invitationsData[invitationIndex]);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        console.error('PATCH /api/invitations/[id] error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
    const invitationIndex = invitationsData.findIndex(inv => inv.id === params.id);
    if (invitationIndex === -1) {
        return new Response('Invitation not found', { status: 404 });
    }

    invitationsData.splice(invitationIndex, 1);
    return new Response(null, { status: 204 });
}
