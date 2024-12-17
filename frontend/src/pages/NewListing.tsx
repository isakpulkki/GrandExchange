import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import CustomBox from '../components/CustomBox';

export default function NewListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [message, setMessage] = useState('');

  const LIMITS = { title: 80, description: 500, price: 10 };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (value.length > LIMITS[name as keyof typeof LIMITS]) return;

    if (name === 'price' && value && !/^\d+$/.test(value)) return;

    setMessage('');
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, description, price } = formData;

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('You must be logged in to add listings.');
      return;
    }

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: parseInt(price, 10),
        }),
      });

      if (response.ok) {
        setMessage('Listing submitted successfully! Awaiting admin review.');
        setFormData({ title: '', description: '', price: '' });
      } else {
        const error = await response.json();
        setMessage(
          error.message || 'Failed to add the listing. Please try again.'
        );
      }
    } catch {
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <CustomBox>
      <Typography variant="h4">Add a New Listing</Typography>
      <form onSubmit={handleSubmit}>
        {['title', 'description', 'price'].map((field) => (
          <TextField
            key={field}
            fullWidth
            label={
              field === 'price'
                ? 'Price in euros'
                : field.charAt(0).toUpperCase() + field.slice(1)
            }
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            margin="normal"
            required
            multiline={field === 'description'}
            rows={field === 'description' ? 4 : undefined}
            helperText={`${formData[field as keyof typeof formData].length}/${
              LIMITS[field as keyof typeof LIMITS]
            }`}
          />
        ))}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
      {message && (
        <Typography
          sx={{ mt: 2 }}
          color={message.includes('success') ? 'green' : 'red'}
        >
          {message}
        </Typography>
      )}
    </CustomBox>
  );
}
