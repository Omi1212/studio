

import type { TokenFormValues } from "@/components/issue-token/issue-token-form";

export interface TokenDetails extends TokenFormValues {
  id: string;
  publicKey: string;
  status: 'pending' | 'active' | 'frozen' | 'draft';
  savedStep?: number;
}

export type ViewMode = 'card' | 'table';
