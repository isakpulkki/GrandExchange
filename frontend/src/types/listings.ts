import { Listing as listingType } from './listing';

export interface ListingsProps {
  listings: listingType[];
  handleDelete?: (id: number) => void;
  handleApprove?: (id: number) => void;
  admin?: boolean;
}