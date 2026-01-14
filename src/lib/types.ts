
import type { TokenFormValues } from "@/components/issue-token/issue-token-form";

export interface TokenDetails extends TokenFormValues {
  id: string;
  publicKey: string;
  status: 'pending' | 'active' | 'frozen' | 'draft';
  price?: number;
  savedStep?: number;
}

export type ViewMode = 'card' | 'table';

export type Order = {
  id: string;
  investorId: string;
  investorName: string;
  tokenId: string;
  tokenTicker: string;
  type: 'Buy' | 'Sell';
  amount: number;
  price: number;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
}

export type Transfer = {
    txId: string;
    type: 'Transfer' | 'Mint' | 'Burn';
    from: string;
    to: string;
    amount: number;
    tokenTicker: string;
    date: string;
}
