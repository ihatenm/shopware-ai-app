import {
    TableRow,
    TableCell,
    TableHead,
  } from '@mui/material';
  
  export default function ProductValidationTableHead() {
    return (
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Artikelnummer</TableCell>
          <TableCell>Fehlende Felder</TableCell>
          <TableCell>Vollständigkeit</TableCell>
        </TableRow>
      </TableHead>
    );
  }