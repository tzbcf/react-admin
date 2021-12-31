/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-30 14:50:10
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef} from 'react';
import DeviceTree, {CRef} from 'src/components/business/deviceTree';

const DeviceTreePage = () => {
    const cRef = useRef<CRef>();
    const onNodeCheck = (value: any) => {
        console.log('onNodeCheck--------', value);
    };

    return (
        <DeviceTree cRef={cRef} isExpand={true} checkbox={false} onNodeCheck={onNodeCheck} checkType={true} />
    );
} ;

export default DeviceTreePage;

