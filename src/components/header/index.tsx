/*
 * FileName : header.tsx
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-17 17:53:50
 * Description : 
 * -----
 * Last Modified: 2020-04-09 11:20:34
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */


import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'antd';
import { ADDUSERINFO} from '../../store/user';

interface State {
  a: number,
  name: string
}
interface Props {
    name: string
}
export default class Header extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      a: 2,
      name: props.name
    }
  }
  hondleClick(){
    this.setState({
      a: 7
    })
    store.dispatch({type: ADDUSERINFO, data: {
      user: 'values.username',
      password: 'values.password',
      }
    })
  }
  render () {
    const {userinfo} = store.getState().user;
    console.log("--------")
    return (
      <div>
        我是header{this.props.name}
        <Link to="/home/articre">Tacos</Link>
        <Link to="/home/details">Tacos</Link>
        <Button type="primary" onClick={this.hondleClick.bind(this)}>有bind点击</Button>
        我是改变的a={this.state.a}
        <p>user={userinfo.user}</p>
        <p>password={userinfo.password}</p>
      </div>
    )
  }
}



