import { useState } from 'react';
import {
  Stack,
  Avatar,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import type { ShopwareProductData } from 'src/types/product';

type Props = {
  product: ShopwareProductData;
};

export default function ProductTableRow({ product }: Props) {
  console.log('Rendering product:', product); // DEBUG
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Optional Chaining für sicheren Zugriff auf mainDetail
  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" noWrap>
            {product.name}
          </Typography>
        </Stack>
      </TableCell>

      {/* Sicherer Zugriff auf mainDetail mit Optional Chaining */}
      <TableCell>{product.mainDetail?.number || 'N/A'}</TableCell>
      <TableCell>{product.mainDetail?.purchasePrice || 0} €</TableCell>
      <TableCell>{product.mainDetail?.inStock || 0}</TableCell>

      <TableCell>
        <Label color={product.active ? 'success' : 'error'}>
          {product.active ? 'Aktiv' : 'Inaktiv'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Bearbeiten
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Löschen
        </MenuItem>
      </Popover>
    </TableRow>
  );
}