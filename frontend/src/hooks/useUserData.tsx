import { useEffect, useState } from 'react';
import { UserData } from '../types/user';

export default function useUserData() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userResponse = await fetch('/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            console.error('Failed to fetch user data.');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };
    fetchUserData();
  }, []);

  return user;
}
