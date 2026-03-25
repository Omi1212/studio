
import type { SubscriptionStatus } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __subscriptionsData__: Record<string, Record<string, SubscriptionStatus>> | undefined;
}

const initialData: Record<string, Record<string, SubscriptionStatus>> = {
    "inv-001": {
        "btkn1-utxo-asset": "approved",
        "btkn1-flashsparks-asset": "pending",
    },
};

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__subscriptionsData__) {
  global.__subscriptionsData__ = JSON.parse(JSON.stringify(initialData));
}

export let subscriptionsData: Record<string, Record<string, SubscriptionStatus>> = global.__subscriptionsData__ || initialData;
