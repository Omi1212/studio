import { NextResponse } from 'next/server';
import { z } from 'zod';
import { usersData } from '../../users/data';
import { investorsData } from '../data';
import { subscriptionsData } from '../subscriptions/data';
import type { User } from '@/lib/types';

const inviteSchema = z.object({
  email: z.string().email(),
  inviteScope: z.enum(['company', 'asset']),
  assetId: z.string().optional(),
  companyId: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, inviteScope, assetId, companyId } = inviteSchema.parse(body);

        let user = usersData.find(u => u.email === email);

        if (!user) {
            // Create a new user if they don't exist
            const newUser: User = {
                id: `inv-${Math.random().toString(36).substring(2, 9)}`,
                name: email.split('@')[0], // Temporary name
                email,
                role: 'investor',
                walletAddress: 'Not set',
                kycStatus: 'pending',
                status: 'active',
                isFrozen: false,
                holdings: [],
                transactions: [],
                companyId: [companyId],
            };
            usersData.unshift(newUser);
            investorsData.unshift(newUser);
            user = newUser;
        } else {
            // If user exists, ensure they are associated with the company
            if (!user.companyId?.includes(companyId)) {
                user.companyId = [...(user.companyId || []), companyId];
            }
        }
        
        if (inviteScope === 'asset' && assetId) {
            // Create a pending subscription request
            if (!subscriptionsData[user.id]) {
                subscriptionsData[user.id] = {};
            }
            // Don't overwrite if a subscription already exists
            if (!subscriptionsData[user.id][assetId]) {
                 subscriptionsData[user.id][assetId] = 'pending';
            }
        }
        
        // In a real app, an email would be sent here.
        // For now, we just confirm the action.

        return NextResponse.json({ message: 'Invitation processed successfully', userId: user.id }, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
