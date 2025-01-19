import mongoose from 'mongoose';
export type FileType = Parameters<any['beforeUpload']>[0];

export const generateMessageId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};

export const darkModeColors = {
  background: '#171717',
  hoverBackground: '#2e2c2c',
};

export const lightModeColors = {
  background: '#ffffff',
  hoverBackground: '#f2e9e9',
};

export const getBackgroundColor = (isDark: boolean) =>
  isDark ? darkModeColors.background : lightModeColors.background;

export const getHoverBackgroundColor = (isDark: boolean) =>
  isDark ? darkModeColors.hoverBackground : lightModeColors.hoverBackground;

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as any);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
