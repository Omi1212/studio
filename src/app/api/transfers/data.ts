import type { Transfer } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __transfersData__: Transfer[] | undefined;
}

const initialData: Transfer[] = [];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__transfersData__) {
  global.__transfersData__ = [...initialData];
}

export let transfersData: Transfer[] = global.__transfersData__ || initialData;
