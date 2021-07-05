export interface RouterConfigBase {
  key: string;
  title: string;
  icon: string;
  component?: any;
  query?: string;
  requireAuth?: string;
  route?: string;
  login?: boolean;
  isNoSub?: boolean;
}

export interface RouterConfig extends RouterConfigBase{
  subs?: RouterConfigBase[];
}