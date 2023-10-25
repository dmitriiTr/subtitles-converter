
import { Filter } from './types';
export const getData = () => fetch('/api').then(res =>
  res.json()) as Promise<{ message: string, filters: Filter[] }>;

