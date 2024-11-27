import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import dayjs from 'dayjs';
import { HelmetProvider } from 'react-helmet-async';
import { $ME, $THEME_C0NFIG, ThemeConfig } from './components/atoms/root';
import { ServiceErrorManager } from './helpers/service';
import { initService } from './components/services/auth';
import { User } from './components/types/partialUser';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Bootstrap = React.lazy(() => import('./Bootstrap'));
const CustumLoading = React.lazy(
  () => import('./components/pages/home/LoadingSpinner')
);

import Loading from './components/pages/loading/Loading';

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

  if (loading) return <CustumLoading />;
  return (
    <React.Suspense fallback={<Loading />}>
      <HelmetProvider>
        <RecoilRoot
          initializeState={({ set }) => {
            set($ME, init || null);
            set($THEME_C0NFIG, (init?.themConfig as any) || null);
          }}
        >
          <Bootstrap />
        </RecoilRoot>
      </HelmetProvider>
    </React.Suspense>
  );
};

export default App;
