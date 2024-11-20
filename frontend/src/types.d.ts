export type Url = {
  original_url: string;
  name: string;
  short_code: string;
  expires_at: Date;
  url_id: number;
  clicks: number;
};

export type QR = {
  original_url: string;
  name: string;
  short_code: string;
  expires_at: Date;
  url_id: number;
  scans: number;
  base_64: string;
};