// atoms/exampleAtom.ts
import { atom } from 'recoil';
import { User } from '../types/partialUser';

export interface PartialUser {
  accessToken?: string;
  refreshToken?: string;
  user?: User;

  token?: {
    [key: string]: any;
  };
  mode?: 'DARK' | 'LIGHT';
  isCompact?: boolean;
}

export interface the {
  token?: {
    [key: string]: any;
  };
  mode?: 'DARK' | 'LIGHT';
  isCompact?: boolean;
}

export const $THEME_C0NFIG = atom<the>({
  key: 'root:config',
  default: {},
});

export const $ME = atom<PartialUser | null>({
  key: 'auth:me',
  default: null,
});
