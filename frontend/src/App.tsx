import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import Bootstrap from './Bootstrap';
import { $ME } from './components/atoms/root';

const App = () => {
  return (
    <React.Suspense>
      <RecoilRoot>
        <Bootstrap />
      </RecoilRoot>
    </React.Suspense>
  );
};

export default App;
