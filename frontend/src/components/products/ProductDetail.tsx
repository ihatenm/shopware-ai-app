import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Divider,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import type { ShopwareProductData } from '../../types/product';
import { productApi } from '../../services/api';

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<ShopwareProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const response = await productApi.getProduct(productId);
        setProduct(response.data);
      } catch (err) {
        setError('Fehler beim Laden des Produkts');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Kein Produkt gefunden</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {product.name}
        </Typography>

        {/* Hauptinformationen */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell>{product.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Beschreibung</TableCell>
                    <TableCell>{product.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Lange Beschreibung</TableCell>
                    <TableCell>{product.descriptionLong}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell>{product.active ? 'Aktiv' : 'Inaktiv'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Keywords</TableCell>
                    <TableCell>{product.keywords}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* MainDetail Informationen */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Artikel Details
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Artikelnummer</TableCell>
                    <TableCell>{product.mainDetail.number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Lieferantennummer</TableCell>
                    <TableCell>{product.mainDetail.supplierNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Lagerbestand</TableCell>
                    <TableCell>{product.mainDetail.inStock}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Einkaufspreis</TableCell>
                    <TableCell>{product.mainDetail.purchasePrice} €</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>EAN</TableCell>
                    <TableCell>{product.mainDetail.ean}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Gewicht</TableCell>
                    <TableCell>{product.mainDetail.weight || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Maße (L/B/H)</TableCell>
                    <TableCell>
                      {product.mainDetail.len || '-'} / 
                      {product.mainDetail.width || '-'} / 
                      {product.mainDetail.height || '-'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Attribute */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Attribute
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {Object.entries(product.mainDetail.attribute).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>{key}</TableCell>
                      <TableCell>{value?.toString() || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ProductDetail;