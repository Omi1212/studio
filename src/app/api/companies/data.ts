import type { Company } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __companiesData__: Company[] | undefined;
}

const initialData: Company[] = [
  { 
    id: 'bstratus-securities', 
    name: 'Bstratus Securities',
  },
  { 
    id: 'emisores-de-activos-digitales', 
    name: 'Emisores de Activos Digitales',
    legalName: 'Emisores de Activos Digitales, S.A. de C.V.',
    address: 'Colonia San Benito, San Salvador, El Salvador'
  },
  { 
    id: 'neobank-sa-de-cv', 
    name: 'NeoBank SA de CV',
  },
  { 
    id: 'tradfi-bank-sa', 
    name: 'TradFi Bank SA',
  },
  { 
    id: 'global-agents-co', 
    name: 'Global Agents Co.',
    legalName: 'Global Agents Company LLC',
    registrationId: 'GA-12345',
    address: '123 Agent Avenue, Suite 100, Financial District',
    industry: 'Consulting',
    kybStatus: 'verified',
    kybLevel: 2,
  },
  { 
    id: 'poppins-co-associates', 
    name: 'Poppins & Co. Associates',
    legalName: 'Poppins & Co. Associates Ltd.',
    registrationId: 'PC-98765',
    address: '18 Cherry Tree Lane, London',
    industry: 'Financial Services',
    kybStatus: 'pending',
    kybLevel: 0,
  },
  { 
    id: 'blockstratus-platform', 
    name: 'BlockStratus Platform',
    legalName: 'BlockStratus Inc.',
    registrationId: 'BS-ADMIN-001',
    address: '1 Infinite Loop, Cupertino, CA',
    industry: 'Technology',
    kybStatus: 'verified',
    kybLevel: 4,
    website: 'https://blockstratus.com',
    employeeRange: '501-1000',
    countryOfJurisdiction: 'US',
  },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__companiesData__) {
  global.__companiesData__ = [...initialData];
}

export let companiesData: Company[] = global.__companiesData__ || initialData;
