/**
 * 业务组件
 */
import Main from './main';
import Table from './table';
import RoleManage from './roleManage';

export default {
  Main,
  ...Table,
  ...RoleManage
} as any;