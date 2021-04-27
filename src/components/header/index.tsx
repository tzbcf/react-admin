import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import Icons from 'src/components/common/icon';
import { INITSTATE, COLLAPSED_TOGGLE } from 'src/store/common/collapsed';

interface Props extends INITSTATE {
  dispatch: any;
 }

const Header: React.FC<Props> = (props) => {
  const { collapsed, dispatch } = props;
  const history = useHistory();
  const loginOut = () => {
    history.push('/login')
  }
  const toggle = () => {
    dispatch({
      type: COLLAPSED_TOGGLE,
      value: !collapsed
    })
  }
  return (
    <div>
      <a onClick={toggle}>
      {
        React.createElement(Icons[collapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'])
      }
      </a>
      <span>我是头部呢</span>
      <Button type='primary' onClick={loginOut}>退出</Button>
    </div>
  )
}

export default connect((state: any) => {
  return {
    collapsed: state.toggleCollapsed.collapsed
  }
})(Header);