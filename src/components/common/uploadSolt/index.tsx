/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-24 09:27:02
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle } from 'react';
import { Upload, Col, Form, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useFetchState from 'src/utils/useFetchState';

export type UploadRef = {
  getFileList (): any[];
  getFileFolder (): string;
}

type Props = {
  label: string;
  btnTitle: string;
  action: string;
  maxLen: number;
  upRef: React.MutableRefObject<UploadRef | undefined>;
  key: string;
}

const UploadSlot: React.FC<Props> = (props) => {
    const { label, btnTitle, action, maxLen = 1, upRef, key} = props;
    const [ fileList, setFileList ] = useFetchState<any[]>([]);
    const [ fileFolder, setFileFolder ] = useFetchState<string>('');
    const normFile = (e:any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // 上传配置
    const uploadProps = {
        name: 'fileFolder',
        action: action,
        // headers: {
        //     ContentType: 'authorization-text',
        // },
        fileList: fileList,
        onChange (info: any) {
            console.log('a------', info);
            if (info.file.status === 'done') {
                if (info.file.response === 1) {
                    setFileList(info.fileList);
                    setFileFolder(info?.file?.name || '');
                } else {
                    message.error(info.file.response);
                    setFileList([]);
                    setFileFolder('');
                }
            } else if (info.file.status === 'error') {
                setFileList([]);
                setFileFolder('');
                message.error(`${info.file.name} file upload failed.`);
            } else {
                setFileList([]);
                setFileFolder('');
            }
        },
    };

    // 暴露给父级调用的方法
    useImperativeHandle(upRef, () => ({
        getFileList () {
            return fileList;
        },
        getFileFolder () {
            return fileFolder;
        },
    }));

    return (
        <Col span={12} key={key}>
            <Form.Item
                name='fileName'
                valuePropName='fileList'
                getValueFromEvent={normFile}
                rules={[
                    { required: true },
                ]}
                label={label }>
                <Upload {...uploadProps}>
                    <Button disabled={fileList.length >= maxLen} icon={<UploadOutlined />}>{ btnTitle }</Button>
                </Upload>
            </Form.Item>
        </Col>
    );
};

export default UploadSlot;

