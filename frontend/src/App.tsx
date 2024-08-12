import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import Bootstrap from './Bootstrap';

function App() {
  const [count, setCount] = useState(0);

  return (
    <React.Suspense>
      <RecoilRoot>
        <Bootstrap />
      </RecoilRoot>
    </React.Suspense>
  );
}

export default App;
