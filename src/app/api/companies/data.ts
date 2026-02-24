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
    complianceProviders: ['Sumsub', 'Onfido', 'Kyckr'],
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
    complianceProviders: ['Didit', 'Sumsub'],
  },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__companiesData__) {
  global.__companiesData__ = [...initialData];
}

export let companiesData: Company[] = global.__companiesData__ || initialData;
