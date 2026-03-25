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
  {
    id: 'issuer-a-comp',
    name: 'Issuer A',
    legalName: 'Issuer A Inc.',
    address: '123 Main Street, San Francisco, CA',
    registrationId: 'IA-INC-11111',
    industry: 'Technology',
    kybStatus: 'verified',
    kybLevel: 3,
    website: 'https://issuera.com',
    employeeRange: '11-50',
    countryOfJurisdiction: 'US',
    complianceProviders: ['Sumsub', 'Onfido', 'Chainalysis'],
  },
  {
    id: 'issuer-b-comp',
    name: 'Issuer B',
    legalName: 'Issuer B Solutions',
    address: '456 Oak Avenue, London, UK',
    registrationId: 'IB-SOL-22222',
    industry: 'Real Estate',
    kybStatus: 'verified',
    kybLevel: 3,
    website: 'https://issuerb.co.uk',
    employeeRange: '51-200',
    countryOfJurisdiction: 'GB',
    complianceProviders: ['Sumsub', 'Kyckr', 'TRM Labs'],
  },
  {
    id: 'issuer-c-comp',
    name: 'Issuer C',
    legalName: 'Issuer C Holdings',
    address: '789 Pine Road, Singapore',
    registrationId: 'IC-HOL-33333',
    industry: 'Venture Capital',
    kybStatus: 'verified',
    kybLevel: 3,
    website: 'https://issuerc.sg',
    employeeRange: '1-10',
    countryOfJurisdiction: 'SG',
    complianceProviders: ['Didit', 'Onfido', 'Scorechain'],
  },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__companiesData__) {
  global.__companiesData__ = [...initialData];
}

export let companiesData: Company[] = global.__companiesData__ || initialData;
