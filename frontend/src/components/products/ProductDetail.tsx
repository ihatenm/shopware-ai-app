import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

interface ProductDetailProps {
  productId?: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  aiSuggestions?: {
    title?: string;
    description?: string;
    tags?: string[];
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    tags: ''
  });

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        // This is where you'll make an API call to your backend
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        setProduct(data);
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          tags: data.tags.join(', ')
        });
      } catch (err) {
        setError('Failed to load product');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // This is where you'll make an API call to update the product
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          tags: formData.tags.split(',').map(tag => tag.trim())
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Show success message (you can add a snackbar/toast here)
      alert('Product updated successfully');
    } catch (err) {
      setError('Failed to update product');
      console.error('Error:', err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>No product found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Edit Product</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="tags"
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={handleChange}
                helperText="Enter tags separated by commas"
              />
            </Grid>

            {product.aiSuggestions && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="h6">AI Suggestions</Typography>
                  {product.aiSuggestions.title && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2">Suggested Title:</Typography>
                      <Typography>{product.aiSuggestions.title}</Typography>
                      <Button 
                        size="small" 
                        onClick={() => setFormData(prev => ({ ...prev, title: product.aiSuggestions?.title || '' }))}
                      >
                        Apply
                      </Button>
                    </Box>
                  )}
                  {product.aiSuggestions.description && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2">Suggested Description:</Typography>
                      <Typography>{product.aiSuggestions.description}</Typography>
                      <Button 
                        size="small"
                        onClick={() => setFormData(prev => ({ ...prev, description: product.aiSuggestions?.description || '' }))}
                      >
                        Apply
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
};

export default ProductDetail;