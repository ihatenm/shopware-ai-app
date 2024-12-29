import { useState } from 'react';
import {
  Stack,
  TableRow,
  TableCell,
  Typography,
  Chip,
} from '@mui/material';
import type { ShopwareProductData } from 'src/types/product';

type Props = {
  product: ShopwareProductData;
};

export default function ProductValidationTableRow({ product }: Props) {
  // Finde fehlende Felder
  const getMissingFields = (prod: ShopwareProductData) => {
    const missingFields = [];
    
    if (!prod.name) missingFields.push('Name');
    if (!prod.description) missingFields.push('Beschreibung');
    if (!prod.mainDetail?.number) missingFields.push('Artikelnummer');
    if (!prod.mainDetail?.purchasePrice) missingFields.push('Einkaufspreis');
    if (!prod.mainDetail?.inStock) missingFields.push('Lagerbestand');

    return missingFields;
  };

  const missingFields = getMissingFields(product);
  const completeness = ((Object.keys(product).length - missingFields.length) / Object.keys(product).length) * 100;

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" noWrap>
            {product.name || 'Kein Name'}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>{product.mainDetail?.number || 'N/A'}</TableCell>

      <TableCell>
        {missingFields.map((field) => (
          <Chip
            key={field}
            label={field}
            color="error"
            size="small"
            sx={{ m: 0.5 }}
          />
        ))}
      </TableCell>

      <TableCell>
        <Typography 
          color={completeness > 80 ? 'success.main' : completeness > 50 ? 'warning.main' : 'error.main'}
        >
          {completeness.toFixed(0)}%
        </Typography>
      </TableCell>
    </TableRow>
  );
}