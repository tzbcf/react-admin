export interface RouterConfigBase {
  key: string;
  title: string;
  icon?: string;
  component?: string;
  query?: string;
  requireAuth?: string;
  route?: string;
  login?: boolean;
}

export interface RouterConfig extends RouterConfigBase{
  subs?: RouterConfigBase[];
  isSub?: boolean;
}

const menuConfig: {
  menus: RouterConfig[];
  others: RouterConfig[] | [];
  [index: string]: any;
} = {
  menus: [
    {
      key: 'main',
      title: '首页',
      icon: 'HomeOutlined',
      route: '/home/index',
      component: 'Main'
    },
    {
      key: 'table',
      title: '表格',
      route: '/table',
      icon: 'TableOutlined',
      subs: [
        {
          key: 'table_list',
          route: '/home/table/list',
          title: '列表',
          icon: 'UnorderedListOutlined',
          component: 'Table_List'
        },
        {
          key: 'table_detail',
          route: '/home/table/detail',
          title: '详情',
          icon: 'CopyOutlined',
          component: 'Table_Detail'
        }
      ]
    }
  ],
  others: []
};

export default menuConfig;
