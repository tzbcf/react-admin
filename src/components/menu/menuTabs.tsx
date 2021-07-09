/*
 * FileName : menuTabs.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-06 11:32:09
 * Description : 
 * -----
 * Last Modified: 2021-07-07 14:03:31
 * Modified By : 
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { MenuObject, MENUTABS_DELETE } from 'src/store/common/menuTabs';
import { useHistory } from 'react-router-dom';
import { Tag } from 'antd';
import './index.less';

type Props = {
    mes: LangMessage,
    menuTabList: MenuObject[],
    dispatch: any
}

const MenuTabs: React.FC<Props> = (props) => {
  const { menuTabList, mes, dispatch } = props;
  const history = useHistory();
  const closeTabs = (v: MenuObject) => {
    dispatch({
      type: MENUTABS_DELETE,
      value: v
    })
  }
  const routeLink = (v: MenuObject) => {
    history.push(v.route);
  } 
    return (
      <div id='menuTabs'>
          <ul className='content'>
              {
                  menuTabList.map((v: MenuObject) => (
                      <li key={v.key}>
                          <Tag 
                            closable 
                            color='#87d068'
                            onClose={() => closeTabs(v)} 
                            onClick={()=>{routeLink(v)}}>
                              {mes[v.title]}
                            </Tag>
                      </li>
                  ))
              }
          </ul>
      </div>
    )
}

export default connect((state: any) => {
    return {
      mes: state.langSwitch.message,
      menuTabList: state.menuTabsDispose.menuTabs
    }
  })(MenuTabs);



