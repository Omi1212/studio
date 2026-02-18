export interface Company {
  id: string;
  name: string;
}

// Use a global variable in development to preserve data across HMR
declare global {
  var __companiesData__: Company[] | undefined;
}

const initialData: Company[] = [
  { id: 'bstratus-securities', name: 'Bstratus Securities' },
  { id: 'emisores-de-activos-digitales', name: 'Emisores de Activos Digitales' },
  { id: 'neobank-sa-de-cv', name: 'NeoBank SA de CV' },
  { id: 'tradfi-bank-sa', name: 'TradFi Bank SA' },
  { id: 'global-agents-co', name: 'Global Agents Co.' },
  { id: 'poppins-co-associates', name: 'Poppins & Co. Associates' },
  { id: 'blockstratus-platform', name: 'BlockStratus Platform' },
];

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__companiesData__) {
  global.__companiesData__ = [...initialData];
}

export let companiesData: Company[] = global.__companiesData__ || initialData;
