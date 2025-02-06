export interface FilterProps {
  categories: { id: number; name: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  newListing?: boolean;
}