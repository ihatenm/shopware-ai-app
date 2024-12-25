import { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';
import type { Product } from 'src/types/product';

import ProductTableRow from '../components/ProductTableRow';
import ProductTableHead from '../components/ProductTableHead';
import ProductTableToolbar from '../components/ProductTableToolbar';

export default function ProductListView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return (
    <DashboardContent>
      <Container>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Products</Typography>
          
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            href="/products/new"
          >
            New Product
          </Button>
        </Box>

        <Card>
          <ProductTableToolbar 
            filterName={filterName}
            onFilterName={setFilterName}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <ProductTableHead />

                <TableBody>
                  {products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <ProductTableRow
                        key={product.id}
                        product={product}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={products.length}
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