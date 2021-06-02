import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Badge, Popover, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BellOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { INITSTATE, COLLAPSED_TOGGLE } from 'src/store/common/collapsed';
import Lang from 'src/components/common/language';
import { LangMessage } from 'src/store/common/language';
import  logo5  from 'src/assets/imgs/common/logo5.png';
import overseas from 'src/assets/imgs/common/overseas.png';

interface Props extends INITSTATE {
  dispatch: any;
  message: LangMessage;
 }

const HelpHint = (
  <p>
    这是帮助，点击下载文档，查阅文档熟练系统
  </p>
)

type Userprops = {
  msg: LangMessage
}

const UserList: React.FC<Userprops> = (userprops) => {
  const { msg } = userprops;
  const history = useHistory();
  const loginOut = () => {
    history.push('/login')
  }
  return  (
    <Button type='primary' onClick={loginOut}>{ msg['btnOut']}</Button>
  )
}

const Header: React.FC<Props> = (props) => {
  const { collapsed, dispatch, message: msg } = props;
  const [zoomState, setZoomState] = useState(false);
  let [news, serNews] = useState(1);

  const toggle = () => {
    dispatch({
      type: COLLAPSED_TOGGLE,
      value: !collapsed
    })
  }

  const viewZoomToggle = () => {
    setZoomState(!zoomState)
  }

  const increaseNew = () => {
    serNews(news+=1)
  }

  return (
    <Row className='flexCenter flexBetween '>
      <Col>
        <Row>
          <Col className='flexCenter flexColumn mr10'>
            <Row style={{marginBottom: '2px'}}>
              <img src={logo5} alt='logo' />
            </Row>
            <Row>
              <img src={overseas} alt='title' />
            </Row>
          </Col>
          <Col>
            {
              collapsed ? <MenuUnfoldOutlined  className='f16' onClick={toggle} /> :
                <MenuFoldOutlined className='f16' onClick={toggle} />
            }
          </Col>
        </Row>
      </Col>
      <Col >
        <Row className='flexCenter chlidDivML10'>
          <Col>
            <Popover content={HelpHint} placement='bottom'>
              <a href='#'  className='colorBlack85'>
                <QuestionCircleOutlined />
              </a>
            </Popover>
          </Col>
          <Col className='flexCenter'>
            {
              zoomState ? <FullscreenExitOutlined className='f20' onClick={viewZoomToggle} /> :
                <FullscreenOutlined onClick={viewZoomToggle} className='f20' />
            }
          </Col>
          <Col>
            <a href='#' onClick={increaseNew}  className='colorBlack85'>
              <span className='avatar-item'>
                <Badge count={news}>
                  <BellOutlined className='f20' />
                </Badge>
              </span>
            </a>
          </Col>
          <Col className='pl10'>
            <Popover content={<UserList msg={msg} />} placement='bottom' className='flexCenter point'>
              <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
              <span>marginchen</span>
            </Popover>
          </Col>
          <Col>
            <Lang />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default connect((state: any) => {
  return {
    collapsed: state.toggleCollapsed.collapsed,
    message: state.langSwitch.message
  }
})(Header);