import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { HelmetProvider } from 'react-helmet-async';
import { $THEME_C0NFIG, ThemeConfig } from './components/atoms/root';

const Bootstrap = React.lazy(() => import('./Bootstrap'));
const Loading = React.lazy(
  () => import('./components/pages/home/LoadingSpinner')
);

const CustumLoading = React.lazy(
  () => import('./components/pages/loading/Loading')
);

const App = () => {
  return (
    <React.Suspense fallback={<CustumLoading />}>
      <HelmetProvider>
        <RecoilRoot>
          <Bootstrap />
        </RecoilRoot>
      </HelmetProvider>
    </React.Suspense>
  );
};

export default App;
