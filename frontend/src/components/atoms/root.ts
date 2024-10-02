// atoms/exampleAtom.ts
import { atom } from 'recoil';
import { User } from '../types/partialUser';

export interface PartialUser {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

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

export const $ME = atom<User | null>({
  key: 'auth:me',
  default: null,
});
