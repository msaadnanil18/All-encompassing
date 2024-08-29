import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { $THEME_C0NFIG, ThemeConfig } from './components/atoms/root';
// import Bootstrap from './Bootstrap';
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
      <RecoilRoot>
        <Bootstrap />
      </RecoilRoot>
    </React.Suspense>
  );
};

export default App;
