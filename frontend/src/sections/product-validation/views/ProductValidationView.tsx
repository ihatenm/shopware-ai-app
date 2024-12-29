import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';
import type { ShopwareProductData } from 'src/types/product';
import { productApi } from '../../../services/api';

import ProductValidationTableRow from '../components/ProductValidationTableRow';
import ProductValidationTableHead from '../components/ProductValidationTableHead';
import ProductValidationTableToolbar from '../components/ProductValidationTableToolbar';

export default function ProductValidationView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [products, setProducts] = useState<ShopwareProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductValidation();
        if (Array.isArray(response)) {
          setProducts(response);
        } else if (response && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Unerwartetes Datenformat:', response);
          setError('Unerwartetes Datenformat von der API');
        }
      } catch (err) {
        setError('Fehler beim Laden der Produkte');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleFilterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterName.toLowerCase()) ||
    product.mainDetail?.number.toLowerCase().includes(filterName.toLowerCase())
  );

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
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4">Produktvalidierung</Typography>
        </Box>

        <Card>
          <ProductValidationTableToolbar 
            filterName={filterName}
            onFilterName={handleFilterNameChange}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <ProductValidationTableHead />

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
                        <ProductValidationTableRow
                          key={product.id}
                          product={product}
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