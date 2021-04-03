type UrlConfig = {
  url: string;
  title?: string;
  tags?: string[];
};

type DashlordConfig = {
  title: string;
  urls: UrlConfig[];
};

type ZapResultSiteAlert = {
  name: string;
  riskcode: string;
  confidence: string;
  riskdesc: string;
  desc: string;
};

type ZapResultSite = {
  "@name": string;
  "@host": string;
  alerts: ZapResultSiteAlert[];
};

type ZapResult = {
  "@version": string;
  "@generated": string;
  site: ZapResultSite[];
};

type NucleiResultInfo = {
  severity: string;
  name: string;
};

type NucleiResultEntry = {
  request?: string;
  response?: string;
  info: NucleiResultInfo;
  type: string;
  ip: string;
  host: string;
  matched: string;
};

type NucleiResult = NucleiResultEntry[];

type LighthouseResultCategory = {
  title: string;
  id: string;
  score: number;
  description?: string;
};

type LighthouseResultCategoryKey =
  | "performance"
  | "accessibility"
  | "best-practices"
  | "seo"
  | "pwa";

type LighthouseResultCategories = Record<
  LighthouseResultCategoryKey,
  LighthouseResultCategory
>;

type LighthouseResult = {
  requestedUrl: string;
  finalUrl: string;
  categories: LighthouseResultCategories;
  audits: LighthouseResultAudits;
};
