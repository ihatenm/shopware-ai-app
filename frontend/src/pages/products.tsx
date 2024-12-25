import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import  ProductListView from 'src/sections/products/views/ProductListView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Products - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
