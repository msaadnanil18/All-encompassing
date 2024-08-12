import React, { lazy } from 'react';
import { Provider as AntdProvider } from './components/thems/antd';
import { useRecoilValue } from 'recoil';
import { $THEME_C0NFIG } from './components/atoms/root';
import { useDarkMode } from './components/thems/useDarkMode';
import { theme } from 'antd';
const Routes = lazy(() => import('./Routes'));

const Container = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  return (
    <div
      className="w-screen h-screen"
      style={{ backgroundColor: colorBgLayout }}
    >
      <Routes />
    </div>
  );
};

const Bootstrap = () => {
  const isDark = useDarkMode();
  const config = useRecoilValue($THEME_C0NFIG);
  return (
    <AntdProvider theme={config} isDark={isDark} isCompact={config?.isCompact}>
      <Container />
    </AntdProvider>
  );
};

export default Bootstrap;
