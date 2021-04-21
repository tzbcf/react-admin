import React, { useState } from 'react';
import MenuConfig from '../../../router/menuRouter';
// import {RouterConfig } from '../../../router/router';
import { Menu, Button } from 'antd';
// const { SubMenu } = Menu;

// const MenuDom = () => {
//   return (<>
//     {
//       menuList.map(v => {
//         console.log('1-----', v)
//         if (v.subMenu && v.children) {
//           return <SubMenu key={v.key} title={v.name}>{ MenuDom (v.children)}</SubMenu>
//         }
//         return <Menu key={v.key} >{ v.name}</Menu>
//       })
//     }
//   </>)
// }

const MenuTabs = () => {
  const [collapsed, setcollapsed] = useState(false);
  console.log('a-----',MenuConfig )
  const toggleCollapsed = () => {
    setcollapsed(!collapsed);
  }
  return (
    <div>
      <Button type='primary' onClick={toggleCollapsed}></Button>
    <Menu
        mode='inline'
        style={{width: '256px'}}
    inlineCollapsed={collapsed}
    >
      {/* {
        MenuDom(MenuConfig)
      } */}
    </Menu>
    </div>

  );
}

export default MenuTabs;