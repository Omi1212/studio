import type { Company } from '@/lib/types';

// Use a global variable in development to preserve data across HMR
declare global {
  var __companiesData__: Company[] | undefined;
}

const initialData: Company[] = [
  { 
    id: 'bstratus-securities', 
    name: 'Bstratus Securities',
    legalName: 'Bstratus Securities LLC',
    address: '1 Wall Street, New York, NY',
    registrationId: 'BS-SEC-54321',
    industry: 'Financial Services',
    kybStatus: 'verified',
    kybLevel: 3,
    website: 'https://bstratus.com',
    employeeRange: '51-200',
    countryOfJurisdiction: 'US',
  },
  { 
    id: 'emisores-de-activos-digitales', 
    name: 'Emisores de Activos Digitales',
    legalName: 'Emisores de Activos Digitales, S.A. de C.V.',
    address: 'Colonia San Benito, San Salvador, El Salvador',
    registrationId: 'EAD-SV-11223',
    industry: 'FinTech',
    kybStatus: 'pending',
    kybLevel: 1,
    website: 'https://emisores.digital',
    employeeRange: '11-50',
    countryOfJurisdiction: 'SV',
  },
  { 
    id: 'neobank-sa-de-cv', 
    name: 'NeoBank SA de CV',
    legalName: 'NeoBank, S.A. de C.V.',
    address: 'Plaza Futura, San Salvador, El Salvador',
    registrationId: 'NB-SV-99887',
    industry: 'Banking',
    kybStatus: 'verified',
    kybLevel: 2,
    website: 'https://neobank.sv',
    employeeRange: '1-10',
    countryOfJurisdiction: 'SV',
  },
  { 
    id: 'tradfi-bank-sa', 
    name: 'TradFi Bank SA',
    legalName: 'Traditional Finance Bank S.A.',
    address: 'Avenida Financiera 123, Panama City, Panama',
    registrationId: 'TFB-PA-45678',
    industry: 'Banking',
    kybStatus: 'verified',
    kybLevel: 2,
    website: 'https://tradfi.bank',
    employeeRange: '201-500',
    countryOfJurisdiction: 'PA',
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
