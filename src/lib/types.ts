import type { TokenFormValues } from "@/components/issue-token/issue-token-form";

export interface TokenDetails extends TokenFormValues {
  id: string;
  publicKey: string;
  status: 'pending' | 'active' | 'frozen' | 'draft';
  price?: number;
  savedStep?: number;
  issuerId?: string;
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
  status: 'pending' | 'completed' | 'rejected' | 'waiting payment';
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

export type Issuer = {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  issuedTokens: number;
  pendingTokens: number;
  status: 'active' | 'inactive';
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'issuer' | 'agent' | 'superadmin';
  walletAddress: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  kybStatus?: 'verified' | 'pending' | 'rejected';
  status: 'active' | 'inactive';
  phone?: string;
  kycLevel?: number;
  kybLevel?: number;
  country?: string;
  legalName?: string;
  dob?: string;
  idDoc?: string;
  address?: string;
  city?: string;
  businessName?: string;
  joinedDate?: string;
  totalInvested?: number;
  isFrozen?: boolean;
  holdings?: any[];
  transactions?: any[];
};

export type SubscriptionStatus = 'none' | 'pending' | 'approved';
