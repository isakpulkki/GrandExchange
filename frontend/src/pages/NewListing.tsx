import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import CustomBox from '../components/CustomBox';
import Filter from '../components/Filter';
import { LIMITS, MAX_IMAGE_SIZE } from '../config/index';  

const NewListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      setCategories(await response.json());
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (value.length <= LIMITS[name as keyof typeof LIMITS] && (name !== 'price' || /^\d+$/.test(value))) {
      setFormData({ ...formData, [name]: value });
      setMessage('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setMessage('File size exceeds the limit. Please upload a smaller image.');
        setImage(null);
      } else {
        setImage(file);
        setMessage('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, description, price, category } = formData;
    const token = localStorage.getItem('token');

    if (!token ) {
      setMessage('You have to be logged in to submit a new listing.');
      return;
    }
    if ( !image) {
      setMessage('Image must be set for a new listing.');
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', title);
      formDataToSubmit.append('description', description);
      formDataToSubmit.append('price', price);
      formDataToSubmit.append('category', category);
      formDataToSubmit.append('image', image);

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSubmit,
      });

      if (response.ok) {
        setMessage('Listing submitted successfully!');
        setFormData({ title: '', description: '', price: '', category: '' });
        setImage(null);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to add listing.');
      }
    } catch {
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <CustomBox>
      <Typography variant="h4">Add a New Listing</Typography>
      <form onSubmit={handleSubmit}>
        <Filter
          categories={categories}
          selectedCategory={formData.category}
          onCategoryChange={(category) =>
            setFormData({ ...formData, category })
          }
        />
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

        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
            required
          />
        </Button>

        {image && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {image.name}
          </Typography>
        )}
        <Typography color="textSecondary" sx={{ padding: 2 }}>
          Upload an image (JPG, JPEG, PNG) - Max 20Mb
        </Typography>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>

      {message && (
        <Typography color={message.includes('success') ? 'green' : 'red'}>
          {message}
        </Typography>
      )}
    </CustomBox>
  );
};

export default NewListing;