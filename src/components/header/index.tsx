import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import Icons from 'src/components/common/icon';
import { INITSTATE, COLLAPSED_TOGGLE } from 'src/store/common/collapsed';
import Lang from 'src/components/common/language';
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
    <Row>
      <Col>
        <a onClick={toggle}></a>
      </Col>
      <Col>
      {
        React.createElement(Icons[collapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'])
      }
      </Col>
      <Col>
        <Lang />
      </Col>
      <Col>
        <Button type='primary' onClick={loginOut}>退出</Button>
      </Col>
    </Row>
  )
}

export default connect((state: any) => {
  return {
    collapsed: state.toggleCollapsed.collapsed
  }
})(Header);