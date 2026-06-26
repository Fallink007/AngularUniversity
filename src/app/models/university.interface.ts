export interface University {
  name: string;
  country: string;
  'state-province': string | null;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
}

export interface SearchHistory {
  country: string;
  date: string;
  count: number;
}
