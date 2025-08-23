// types.ts

export type SiteCategory =
  | "national"
  | "regional/local"
  | "tabloid"
  | "business"
  | "sports"
  | "tech"
  | "culture/arts"
  | "investigative"
  | "other";

export type RobotsStatus = "allowed" | "likely_allowed" | "unclear" | "disallowed";

export interface Evidence {
  url: string;
  note?: string;
}

export interface NewsSite {
  name: string;
  homepage: string;            // canonical homepage (https://example.tld)
  country: string;             // echo of requested country
  language?: string;           // best-guess primary language
  category: SiteCategory;
  free_access: boolean;        // no hard/metered paywall
  robots_txt: string;          // https://example.tld/robots.txt
  robots_status: RobotsStatus; // assessment based on robots.txt
  rss_feeds: string[];         // if discoverable
  popularity_hint?: string;    // why it’s widely read domestically (proxy)
  evidence: Evidence[];        // include robots.txt + a sample article
  notes?: string;              // small nuance (ads, consent wall, etc.)
}

export interface NewsSourceList {
  country: string;
  requested_count: number;
  sites: NewsSite[];
}
