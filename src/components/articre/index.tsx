/*
 * FileName : index.vue
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-18 11:17:26
 * Description : 
 * -----
 * Last Modified: 2020-03-18 11:17:52
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */

import React from 'react';
interface State {
  a: number,
}
export default class Articre extends React.Component<{}, State> {
  constructor(props: {}){
    super(props);
    this.state = {
      a: 2,
    }
  }
  render () {
    const {a} = this.state
    return (
      <div>
        我是Articre{a}
      </div>
    )
  }
}




