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

export type Analytics = {
  url_id: number;
  click_count: number;
  referrers: {
    name: string;
    count: number;
  };
  browsers: {
    name: string;
    count: number;
  };
  operating_systems: {
    name: string;
    count: number;
  };
  countries: {
    name: string;
    count: number;
  };
  regions: {
    name: string;
    count: number;
  };
  cities: {
    name: string;
    count: number;
  };
};
