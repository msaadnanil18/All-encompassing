export interface addFiles {
  asset_id?: string;
  format?: string;
  api_key?: string;
  url?: string;
  bytes?: number;
  resource_type?: string;
  original_filename?: string;
  error?: any;
}

export type DriveModes = 'drive' | 'upload' | 'camera' | 'images' | 'documents';
