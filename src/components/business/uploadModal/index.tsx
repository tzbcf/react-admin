/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-25 10:28:21
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useImperativeHandle} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import useFetchState from 'src/utils/useFetchState';
import { Modal, Button, Row, Col, Input, Upload } from 'antd';
import { PoweroffOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';

export type URef = {
  openModel(): void;
}

type Props = {
  Mes: LangMessage;
  subSysNo: string;
  nodeNo: string;
  uRef: React.MutableRefObject<URef | undefined>; // 暴露给父级组件调用
  title: string; // 弹窗展示的标题
  onfinish: (file:RcFile|null) => Promise<void>; // 选择了上传文件，进行提交操作
  downEvent?: () => void; // 下载模板事件,传了会显示模板按钮
}

const UploadModal: React.FC<Props> = (props) => {
    const { onfinish, title, Mes, downEvent, uRef } = props;
    const [ isModalVisible, setIsModalVisible ] = useFetchState<boolean>(false);
    const [ txtName, setTextName ] = useFetchState<string>('');
    const [ uploadData, setUploadData ] = useFetchState<RcFile | null>(null);
    const UploadProps = {
        showUploadList: false,
        beforeUpload (file:RcFile) {
            setTextName(file.name);
            setUploadData(file);
            return false;
        },
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = async () => {
        if (typeof onfinish === 'function') {
            onfinish(uploadData).then(() => handleCancel());
        }
    };

    // 暴露给父级调用的方法
    useImperativeHandle(uRef, () => ({
        openModel () {
            setIsModalVisible(true);
        },
    }));

    return (
        <Modal
            title={title}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button
                    key='back'
                    icon={<PoweroffOutlined />}
                    onClick={handleCancel}
                >{Mes['titleLabelCloseclose']}</Button>,
                <Button
                    key='save'
                    icon={<UploadOutlined />}
                    onClick={handleOk}
                >{Mes['btnUploadupload']}</Button>,
            ]}
        >
            <Row gutter={24} justify='center'>
                <Col span={12}>
                    <Input disabled value={txtName} title={txtName} />
                </Col>
                <Col span={6}>
                    <Upload {...UploadProps}>
                        <Button icon={<UploadOutlined />}>{Mes['btnBrowsebrowse']}</Button>
                    </Upload>
                </Col>
                {
                    typeof downEvent === 'function' && <Col span={2}>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={downEvent}
                            title={Mes['btnTemplatetemplate']}></Button>
                    </Col>
                }
            </Row>
        </Modal>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(UploadModal);

