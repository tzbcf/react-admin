// eslint-disable-next-line no-use-before-define
import React from 'react';
import { LangMessage } from 'src/store/common/language';
import { Form, Input, Upload, Button, message } from 'antd';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import useFetchState from 'src/utils/useFetchState';
import { UploadOutlined } from '@ant-design/icons';
import { basicData } from 'src/api';
import { UploadResult, excelUpload } from 'src/api/http';
import { randomStr } from 'src/utils/utils';
import { hideLoading, showLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const ExcelFileTab: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const [ form ] = Form.useForm();
    const [ fileList, setFileList ] = useFetchState<any[]>([]);

    const uploadProps = {
        onRemove: (file:any) => {

            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();

            newFileList.splice(index, 1);
            setFileList(newFileList);

        },
        beforeUpload: (file: any) => {
            const list = [ ...fileList ];

            list.splice(0, list.length);
            list.push(file);
            setFileList(list);
            return false;
        },
        fileList,
        maxCount: 1,
    };

    const handleUpload = (name:string) => {
        if (!fileList.length) {
            message.warn('Excel file is not recognized');
            return;
        }
        const formData = new FormData();
        let fileId = randomStr(32);

        formData.append('uppath', fileId);
        formData.append('scheme_id', name);
        formData.append('delflag', '1');
        fileList.forEach((file) => {
            formData.append('file1', file);
        });

        // You can use any AJAX library you like
        showLoading();
        excelUpload(formData).then((res: UploadResult) => {
            console.log(res);
            hideLoading();
            message.success('The operation has started. Please pay attention to the progress');
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
    };

    const uploadBtnList: BtnConfig[] = [
        {
            type: 'Export',
            btnType: 'primary',
            title: Mes['btnUpexcelupexcel'],
            onClick () {
                form.validateFields().then((data) => {
                    const name = data.name;

                    if (fileList.length > 0) {
                        basicData.excelImpotMgt.checkName({ schemeName: name, subSysNo }).then(() => {
                            handleUpload(name);
                        });
                    }
                });
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            title: Mes['btnLoaddatabaseloaddatabase'],
            onClick () {
                console.log('11111');
            },
        },
        {
            type: 'Download',
            btnType: 'primary',
            title: Mes['btnTemplatetemplate'],
            onClick () {
                window.location.href = '/v1/amr/excel/ExcelFileTemplate.xlsx';
            },
        },
    ];

    return (
        <div>
            <Form form={form}
                name='langForm'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                preserve={false}>
                <Form.Item name='name' label={ Mes['titleTableSchemenameschemename']} rules={[ { required: true } ]}>
                    <Input maxLength={20} style={{width: '50%'}}></Input>
                </Form.Item>

                <Form.Item name='file' label={ Mes['titleLabelSelectexcelfileselectexcelfile']}>
                    <Upload {...uploadProps} style={{width: '50%'}}>
                        <Button icon={<UploadOutlined />}>Browse File</Button>
                    </Upload>
                    <div style={{margin: '10px'}}>
                        <BtnList btnList={uploadBtnList}/>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ExcelFileTab;
