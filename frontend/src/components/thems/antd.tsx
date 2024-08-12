import React from 'react';

import { theme as antdTheme, ConfigProvider } from 'antd';
import { ConfigProviderProps } from 'antd/es/config-provider';
import { StyleProvider } from '@ant-design/cssinjs';

interface Props extends ConfigProviderProps {
  isDark?: boolean;
  isCompact?: boolean;
}
export const Provider: React.FC<Props> = ({
  isDark,
  isCompact,
  children,
  theme,
  ...props
}) => (
  <ConfigProvider
    theme={{
      ...theme,
      ...(theme && theme.token && theme.token.colorPrimary
        ? {
            components: {
              Typography: {
                colorLink: theme.token.colorPrimary,
              },
              Button: {
                colorLink: theme.token.colorPrimary,
              },
            },
          }
        : {}),
      algorithm: isCompact
        ? antdTheme.compactAlgorithm
        : isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
    }}
    {...props}
  >
    <StyleProvider hashPriority="high">{children}</StyleProvider>
  </ConfigProvider>
);
