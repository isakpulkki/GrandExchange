import { Listing } from '../types/listing';

export const handleDelete = async (
  id: number,
  token: string | null,
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>
) => {
  if (!token) {
    console.error('No token found, cannot delete listing.');
    return;
  }

  try {
    const response = await fetch(`/api/listings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    setListings((prevListings) =>
      prevListings.filter((listing) => listing.id !== id)
    );
  } catch (error) {
    console.error('Error deleting listing: ', error);
  }
};
