import { 
    Toolbar,
    OutlinedInput,
    InputAdornment,
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import { Iconify } from 'src/components/iconify';
  
  const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
  }));
  
  const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
      width: 320,
      boxShadow: theme.customShadows?.z8,
    },
  }));
  
  interface ProductTableToolbarProps {
    filterName: string;
    onFilterName: (value: string) => void;
  }
  
  export default function ProductTableToolbar({
    filterName,
    onFilterName,
  }: ProductTableToolbarProps) {
    return (
      <StyledRoot>
        <StyledSearch
          value={filterName}
          onChange={(e) => onFilterName(e.target.value)}
          placeholder="Produkt suchen..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      </StyledRoot>
    );
  }