import { 
    Toolbar,
    TextField,
  } from '@mui/material';
  import { Iconify } from 'src/components/iconify';
  
  interface ProductValidationTableToolbarProps {
    filterName: string;
    onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export default function ProductValidationTableToolbar({ 
    filterName, 
    onFilterName 
  }: ProductValidationTableToolbarProps) {
    return (
      <Toolbar sx={{ p: 2 }}>
        <TextField
          size="small"
          value={filterName}
          onChange={onFilterName}
          placeholder="Suche Produkte..."
          InputProps={{
            startAdornment: <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />,
          }}
        />
      </Toolbar>
    );
  }