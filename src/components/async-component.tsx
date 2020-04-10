/**
 * FileName : async-component.ts
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-17 15:44:06
 * Description : 
 * -----
 * Last Modified: 2020-03-17 16:06:14
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */
import React from 'react';
interface State {
    component: any;
}
export default (loadComponent: any, placeholder = '加载中....') => {
    return class AsyncComponent extends React.Component<{}, State> {
        constructor(props: any) {
            super(props);
            this.state = {
                component: null,
            }
        }
        async componentDidMount() {
            const {default: component} = await loadComponent();
            this.setState({
                component
            })
        }
        render(){
            const C = this.state.component; 
            return (
                C ? <C {...this.props} /> : placeholder
            )
        }
    }
}