import type { Order } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __ordersData__: Order[] | undefined;
}

const initialData: Order[] = [];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__ordersData__) {
  global.__ordersData__ = [...initialData];
}

export let ordersData: Order[] = global.__ordersData__ || initialData;
