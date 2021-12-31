// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import SearchList from 'src/components/business/searchList';
type Props = {
  message: LangMessage,
}

const SearchListPage: React.FC<Props> = () => {
    const columns: any[] = [
        {
            type: 'Input',
            name: 'name',
            label: '姓名',
            props: {
                placeholder: '测试',
            },
            rules: [ { required: true } ],
        },
        {
            type: 'Select',
            name: 'projectType',
            label: '类型',
            options: [
                {
                    value: '1',
                    name: '入门',
                },
                {
                    value: '2',
                    name: '普调',
                },
                {
                    value: '3',
                    name: '专业',
                },
            ],
            props: {
                defaultValue: '1',
            },
        },
        {
            type: 'DatePicker',
            name: 'date',
            label: '时间',
            props: {
                showTime: 'showTime',
            },
        },
        {
            type: 'DatePicker',
            name: 'date',
            label: '时间',
            props: {
                showTime: 'showTime',
            },
        },
    ];
    const onFinish = (values: any) => {
        console.log(values);
    };

    return <div>
        <SearchList columns={columns} onFinish={onFinish} />
    </div>;
};

export default connect((state: any) => ({
    message: state.langSwitch.message,
}))(SearchListPage);
