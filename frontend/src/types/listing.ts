export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  user: string;
  image: string; 
  category?: string;
  visible?: boolean;
  handleDelete?: (id: number) => void;
  handleApprove?: (id: number) => void;
}