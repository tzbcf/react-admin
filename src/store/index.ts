import {combineReducers} from 'redux';
import { toggleCollapsed } from './common/collapsed'; // 控制左边侧边栏
import { langSwitch } from './common/language'; // 控制语言切换
import { menuTabsDispose } from './common/menuTabs';
import { toggleNews } from './common/news';

const mergeReucer = combineReducers({
  toggleCollapsed,
  langSwitch,
  menuTabsDispose,
  toggleNews
});

export default mergeReucer;