// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Card, List } from 'antd';
import './index.less';

export type CardItemData = {
    label: string;
    value: string;
}

type Props = {
    list: CardItemData[];
};

const CardItem:React.FC<Props> = (props:Props) => {
    const { list } = props;

    return (<>

        <div>
            <Card style={{ margin: '10px' }}>
                <List
                    dataSource={list}
                    grid={{
                        column: 2,
                    }}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <span className='label' title={item.label}>
                                {item.label}:
                            </span>
                            <span className='value' title={item.value}>
                                {item.value}
                            </span>
                        </List.Item>
                    )}
                />
            </Card>
        </div>

    </>);
};

export default CardItem;
