import type { SubscriptionStatus } from '@/lib/types';

export let subscriptionsData: Record<string, Record<string, SubscriptionStatus>> = {
    'inv-001': { // Hardcoded investor ID for demo
        'example-1': 'approved',
    }
};
