import { useEffect, useState } from 'react';
import { Listing } from '../types/listing';

const useListings = (visible: boolean) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const baseUrl = '/api/listings';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(baseUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch listings.');
        const data = await response.json();
        const filteredListings = data.filter((listing: Listing) => listing.visible === visible);
        setListings(filteredListings);
      } catch (error) {
        console.error('Error fetching listings: ', error);
      }
    };
    fetchListings();
  }, [baseUrl, token, visible]);

  return { listings, setListings };
};

export default useListings;
