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
import type { Product } from 'src/types/product';

type Props = {
  product: Product;
};

export default function ProductTableRow({ product }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    router.push(`/products/${product.id}/edit`);
    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              variant="rounded"
              src={product.images[0]}
              alt={product.title}
              sx={{ width: 48, height: 48 }}
            />
            
            <Typography variant="subtitle2" noWrap>
              {product.title}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{product.shopwareId}</TableCell>

        <TableCell>{product.price}</TableCell>

        <TableCell>
          <Label color={
            (product.status === 'active' && 'success') ||
            (product.status === 'draft' && 'warning') || 
            'error'
          }>
            {product.status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}