import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { HelmetProvider } from 'react-helmet-async';
import { $ME, $THEME_C0NFIG, ThemeConfig } from './components/atoms/root';
import { ServiceErrorManager } from './helpers/service';
import { initService } from './components/services/auth';
import { User } from './components/types/partialUser';

const Bootstrap = React.lazy(() => import('./Bootstrap'));
const Loading = React.lazy(
  () => import('./components/pages/home/LoadingSpinner')
);

const CustumLoading = React.lazy(
  () => import('./components/pages/loading/Loading')
);

const App = () => {
  const [init, setInit] = React.useState<User>();
  const [loading, setLoding] = React.useState<boolean>(false);
  const initializeApp = React.useCallback(async () => {
    setLoding(true);
    ServiceErrorManager(initService({}), {})
      .then(([_, data]) => {
        setInit(data.data);
      })
      .finally(() => {
        setLoding(false);
      });
  }, []);

  React.useEffect(() => {
    initializeApp().catch(console.log);
  }, []);

  if (loading) return <Loading />;
  return (
    <React.Suspense fallback={<CustumLoading />}>
      <HelmetProvider>
        <RecoilRoot
          initializeState={({ set }) => {
            set($ME, init || null);
            set($THEME_C0NFIG, init?.themConfig as any);
          }}
        >
          <Bootstrap />
        </RecoilRoot>
      </HelmetProvider>
    </React.Suspense>
  );
};

export default App;
