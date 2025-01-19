import Service from '../../helpers/service';
export const loginService = Service('/api/login');
export const updateThemeConfig = Service('/api/update/theme-config');
export const userRegisterService = Service('/api/register');
export const initService = Service('/api/init');
export const logoutService = Service('/api/logout');
export const ProfileEditService = Service('/api/profile/edit');
export const SaveMainComponentFunction = Service(
  '/api/saveMainComponentFunction'
);

export const ComponentListService = Service('/api/componentList');
