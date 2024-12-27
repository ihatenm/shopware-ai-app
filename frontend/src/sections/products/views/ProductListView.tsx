import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import type { ShopwareProduct, ShopwareProductData } from 'src/types/product';
import { productApi } from '../../../services/api';

import ProductTableRow from '../components/ProductTableRow';
import ProductTableHead from '../components/ProductTableHead';
import ProductTableToolbar from '../components/ProductTableToolbar';

export default function ProductListView() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [products, setProducts] = useState<ShopwareProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts();
        console.log('API Response:', response); // DEBUG log
        
        // Prüfe, ob response.data ein Array ist
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // Falls die API die Daten in einem data-Objekt verschachtelt
          setProducts(response.data.data);
        } else {
          console.error('Unerwartetes Datenformat:', response.data);
          setError('Unerwartetes Datenformat von der API');
        }
      } catch (err) {
        setError('Fehler beim Laden der Produkte');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Bearbeiten-Funktion
  const handleEdit = (productId: number) => {
    router.push(`/products/${productId}/edit`);
  };

  // Filter products based on name
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterName.toLowerCase()) ||
    product.mainDetail.number.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleFilterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  // Debug-Ausgabe
  console.log('Current products state:', products);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <DashboardContent>
      <Container>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Produkte</Typography>
          
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            href="/products/new"
          >
            Neues Produkt
          </Button>
        </Box>

        <Card>
        <ProductTableToolbar 
            filterName={filterName}
            onFilterName={handleFilterNameChange} // Verwende die neue Handler-Funktion
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <ProductTableHead />

                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Keine Produkte gefunden
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product) => (
                        <ProductTableRow
                          key={product.id}
                          product={product}
                          onEdit={handleEdit} // Details anstatt Edit (Bin zu faul um namen zu ändern)
                        />
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </DashboardContent>
  );
}