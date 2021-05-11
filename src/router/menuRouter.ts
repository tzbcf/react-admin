export interface RouterConfigBase {
  key: string;
  title: string;
  icon: string;
  component?: string;
  query?: string;
  requireAuth?: string;
  route?: string;
  login?: boolean;
  isNoSub?: boolean;
}

export interface RouterConfig extends RouterConfigBase{
  subs?: RouterConfigBase[];
}

const menuConfig: {
  menus: RouterConfig[];
  others: RouterConfig[] | [];
  [index: string]: any;
} = {
  menus: [
    {
      key: 'main',
      title: 'mainTitle',
      icon: 'HomeOutlined',
      route: '/home/index',
      component: 'Main'
    },
    {
      key: 'table',
      title: 'tableTitle',
      route: '/table',
      icon: 'TableOutlined',
      subs: [
        {
          key: 'table_list',
          route: '/home/table/list',
          title: 'tableList',
          icon: 'UnorderedListOutlined',
          component: 'Table_List'
        },
        {
          key: 'table_detail',
          route: '/home/table/detail',
          title: 'tableDetail',
          icon: 'CopyOutlined',
          isNoSub: true,
          component: 'Table_Detail'
        }
      ]
    }
  ],
  others: []
};

export default menuConfig;
