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
          <TableCell>Name</TableCell>
          <TableCell>Artikelnummer</TableCell>
          <TableCell>Preis</TableCell>
          <TableCell>Bestand</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Aktionen</TableCell>
        </TableRow>
      </TableHead>
    );
  }