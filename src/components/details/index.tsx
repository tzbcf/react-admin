/*
 * FileName : index.tsx
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-18 11:19:11
 * Description : 
 * -----
 * Last Modified: 2020-03-18 13:25:44
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */



import React from 'react';
interface State {
  a: number,
}
export default class Details extends React.Component<{}, State> {
  constructor(props: {}){
    super(props);
    this.state = {
      a: 3,
    }
  }
  render () {
    const {a} = this.state
    return (
      <div>
        details{a}
      </div>
    )
  }
}


