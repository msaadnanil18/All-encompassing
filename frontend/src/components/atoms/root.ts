// atoms/exampleAtom.ts
import { atom } from 'recoil';

export interface ThemeConfig {
  token?: {
    [key: string]: any;
  };
  mode?: 'DARK' | 'LIGHT';
  isCompact?: boolean;
}

export const $THEME_C0NFIG = atom<ThemeConfig>({
  key: 'root:config',
  default: {},
});
