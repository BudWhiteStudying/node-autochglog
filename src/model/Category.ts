import { Commit } from './Commit';

export interface Category {
  name: string;
  commits: Commit[];
}
