/**
 * 在有些场景中使用icon['CopyrightOutlined'],ts提示报错。所以外加层皮，并any不检查，同时只导入需要的icon
 */

import {
  HomeOutlined,
  TableOutlined,
  UnorderedListOutlined,
  CopyOutlined,
  UserOutlined,
  LockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CopyrightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons'

export default {
  HomeOutlined,
  TableOutlined,
  UnorderedListOutlined,
  CopyOutlined,
  UserOutlined,
  LockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CopyrightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} as any;
