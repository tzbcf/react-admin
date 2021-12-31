/*
 * FileName : customIcon.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-03 15:02:32
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import Icon from '@ant-design/icons';

const RoundSvg = () => (
    <svg className='icon' viewBox='0 0 1024 1024' p-id='10943' width='1em' fill='currentColor' height='1em'>
        <path d='M511.998497 511.994389m-121.263158-210.03395a242.526316 242.526316 0 1 0 242.526315 420.067901 242.526316 242.526316 0 1 0-242.526315-420.067901Z' p-id='10944'></path>
        <path d='M511.998497 511.994389m-94.31579-163.359739a188.631579 188.631579 0 1 0 188.631579 326.719479 188.631579 188.631579 0 1 0-188.631579-326.719479Z' p-id='10945'></path>
    </svg>
);

export const RoundIcon = (props: any) => <Icon component={RoundSvg} {...props} />;

const QuickMenu = () => (
    <svg className='icon' viewBox='0 0 1024 1024' p-id='864' width='16' height='16'>
        <path
            // eslint-disable-next-line max-len
            d='M599.466667 917.333333c-8.533333 0-17.066667-4.266667-21.333334-10.666666l-189.866666-292.266667-292.266667-189.866667c-6.4-6.4-10.666667-14.933333-10.666667-23.466666 0-8.533333 6.4-17.066667 14.933334-21.333334L904.533333 66.133333c8.533333-4.266667 19.2-2.133333 25.6 6.4 6.4 6.4 8.533333 17.066667 6.4 25.6L622.933333 902.4c-4.266667 8.533333-12.8 14.933333-23.466666 14.933333zM164.266667 409.6l256 166.4c2.133333 2.133333 6.4 4.266667 6.4 6.4l166.4 256 277.333333-706.133333-706.133333 277.333333z m0 0'
            p-id='865'
            fill='#555555'></path>
        <path
            // eslint-disable-next-line max-len
            d='M407.466667 620.8c-10.666667 0-19.2-6.4-23.466667-14.933333-4.266667-8.533333-2.133333-19.2 6.4-27.733334L896 70.4c10.666667-10.666667 25.6-10.666667 34.133333 0 10.666667 10.666667 10.666667 25.6 0 34.133333L424.533333 612.266667c-4.266667 6.4-10.666667 8.533333-17.066666 8.533333z m0 0'
            p-id='866'
            fill='#555555'></path>
    </svg>
);

export const QuickMenuIcon = (props: any) => <Icon component={QuickMenu} {...props} />;

const RingSvg = () => (
    <svg
        className='icon'
        viewBox='0 0 1025 1024'
        p-id='4648'
        width='16'
        height='16'>
        <path
            d='M835.213352 511.352547a321.181751 321.181751 0 0 1-70.727407 201.540061l134.844777 134.844777A512.542354 512.542354 0 0 0 548.007197 0v190.699599a322.635959 322.635959 0 0 1 287.206155 320.652948z'
            p-id='4649'
            fill='#555555'></path>
        <path
            d='M512.643494 833.922406a322.569859 322.569859 0 0 1-35.363704-643.222807V0a512.608454 512.608454 0 1 0 372.145144 897.841474l-134.844777-134.976978a320.98345 320.98345 0 0 1-201.936663 71.05791z'
            p-id='4650'
            fill='#555555'></path>
    </svg>
);

export const RingIcon = (props: any) => <Icon component={RingSvg} {...props} />;
// export {
//     RoundIcon,
// };

const chrysanthemumLoading = () => (
    <svg
        className='icon'
        viewBox='0 0 1024 1024'
        version='1.1'
        p-id='2424' width='100%' height='100%'>
        <path
            d='M533.333333 682.666667v192h-64v-192h64z m-175.317333-72.618667l45.269333 45.269333-135.765333
            135.744-45.248-45.226666 135.744-135.786667z m286.634667 0l135.744 135.765333-45.226667 45.248-135.786667-135.744
            45.269334-45.269333zM330.666667 480v64h-192v-64h192z m533.333333 0v64h-192v-64h192z m-128.853333-247.061333l45.248
            45.226666-135.744 135.786667-45.269334-45.269333 135.765334-135.744z m-467.626667 0l135.765333 135.744-45.269333
            45.269333-135.744-135.765333 45.226667-45.248zM533.333333 149.333333v192h-64V149.333333h64z'
            p-id='2425'>
        </path>
    </svg>
);

const IconMap = {
    RoundSvg,
    QuickMenu,
    RingSvg,
    chrysanthemumLoading,
};
const CustomIcon = (props: any) => {
    const { IconName, ...args } = props;

    if (IconMap[IconName]) {
        return (
            <Icon component={IconMap[IconName]} {...args} />
        );
    }
    return null;
};

export default CustomIcon;
