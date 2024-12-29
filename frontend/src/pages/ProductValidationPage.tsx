import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import ProductValidationView from 'src/sections/product-validation/views/ProductValidationView';

export default function ProductValidationPage() {
  return (
    <>
      <Helmet>
        <title> {`Produktvalidierung - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductValidationView />
    </>
  );
}