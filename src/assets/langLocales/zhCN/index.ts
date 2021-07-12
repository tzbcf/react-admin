import login from './login';
import menu from './menu';
import common from './common';
import header from './header/';
import operatorMgnt from './operatorMgnt';

export default {
    ...login,
    ...menu,
    ...common,
    ...header,
    ...operatorMgnt,
};
