export interface RouterConfigBase {
  key: string;
  title: string;
  icon?: string;
  component?: any;
  query?: string;
  requireAuth?: boolean;
  route?: string;
  login?: boolean;
  isNoSub?: boolean;
}

export interface RouterConfig extends RouterConfigBase{
  subs?: any[];
}

type ChangePassword = {
  username: string;
}

export type RouterLocation = {
  hash: string;
  pathname: string;
  search: string;
  state: ChangePassword | undefined;
}
