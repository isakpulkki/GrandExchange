import { Listing } from './listing';

export interface UserData {
  username: string;
  admin: boolean;
  listings: Listing[];
}