
import type { Invitation } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __invitationsData__: Invitation[] | undefined;
}

const initialData: Invitation[] = [];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__invitationsData__) {
  global.__invitationsData__ = [...initialData];
}

export let invitationsData: Invitation[] = global.__invitationsData__ || initialData;
