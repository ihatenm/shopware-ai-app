import {
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
  } from '@mui/material';
  
  export default function ProductTableHead() {
    return (
      <TableHead>
        <TableRow>
          <TableCell>Product</TableCell>
          <TableCell>Shopware ID</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
    );
  }