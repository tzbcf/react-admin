// eslint-disable-next-line no-use-before-define
import React, { useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Row, Col, Select, TreeSelect, Button, Modal } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration, user } from 'src/api';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { OpreatorData, OpreatorOnlineData } from 'src/api/configuration/opreatorOnlineMgnt/types';
import { UserNode } from 'src/api/user/type';
import { ClearOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};
type CascaderData = {
    value: string;
    title: string;
    children?: CascaderData[];
}

let nodeNo = '';

const OpreatorOnlineMgt: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { Option } = Select;

    const [ nodeTree, setNodeTree ] = useFetchState<CascaderData[]>([]);
    const [ nodeName, setNodeName ] = useFetchState<string>('');
    const [ opreatorList, setOpreatorList ] = useFetchState<OpreatorData[]>([]);
    const [ opreatorId, setOpreatorId ] = useFetchState<string>('');
    const [ opreatorOnline, setOpreatorOnline ] = useFetchState<OpreatorOnlineData[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);

    const nodeDataFormatCascader = (nodeList: UserNode[], rootNode: CascaderData[], parentId: string|null = null) => {
        const node = nodeList.filter((v: UserNode) => v.PARENTID === parentId);

        node.forEach((item:UserNode) => {
            const findNode = nodeList.find((v:UserNode) => v.PARENTID === item.ID);
            const obj: CascaderData = {
                title: item.NAME,
                value: item.ID,
            };

            // nodeIds.push(item.ID);
            if (findNode) {
                obj.children = [];
                rootNode.push(obj);
                nodeDataFormatCascader(nodeList, obj.children, item.ID);
            } else {
                rootNode.push(obj);
            }
        });
    };

    const getOpreatorList = () => {
        configuration.opreatorOnlineMgnt.getOpreatorList(subSysNo, nodeNo).then((res: OpreatorData[]) => {
            setOpreatorList(res);
        });
    };

    const getOpreatorOnline = () => {
        setLoading(true);
        configuration.opreatorOnlineMgnt.getOpreatorOnline(nodeNo, opreatorId).then((res: OpreatorOnlineData[]) => {
            setOpreatorOnline(res);
            setLoading(false);
        })
            .catch((err) => {
                message.error(err);
                setLoading(false);
            });
    };

    const opreatorOffline = (opreator: string) => {
        configuration.opreatorOnlineMgnt.offline(opreator).then(() => {
            message.success(Mes['messageSuccessOpersuccessopersuccess']);
            getOpreatorOnline();
        })
            .catch((err) => {
                message.error(err);
            });
    };

    const showConfirm = (data:OpreatorOnlineData) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageConfirmSuredeleterecordsuredeleterecord'].replace('(s)', '(' + data.OPERATOR_NAME + ')'),
            onOk () {
                opreatorOffline(data.OPERATOR_ID);
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };


    const getNodeTree = async () => {
        const res = await user.userNodeTree(subSysNo);
        let nodeList: CascaderData[] = [];

        nodeDataFormatCascader(res, nodeList);
        let node = nodeList[0].value;

        setNodeName(node);
        setNodeTree(nodeList);
        nodeNo = nodeList[0].value;
        getOpreatorList();
        getOpreatorOnline();
    };

    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleUserName'],
            dataIndex: 'OPERATOR_NAME',
        },
        {
            title: Mes['titleTableTblcaozuoyuantblcaozuoyuan'],
            dataIndex: 'OPERATOR_ID',
        },
        {
            title: Mes['titleTableFtpipftpip'],
            dataIndex: 'IPADDRESS',
        },
        {
            title: Mes['titleTableOperationoperation'],
            render (record:OpreatorOnlineData) {
                return (
                    <>
                        <Button type='primary' onClick={() => {showConfirm(record);}} title={Mes['titleTableClearcacheclearcache']} icon={ <ClearOutlined />}>

                        </Button>
                    </>
                );
            },
        },
    ];

    const btnList: BtnConfig[] = [
        {
            type: 'Search',
            btnType: 'primary',
            title: Mes['btnTitleSearch'],
            onClick () {
                getOpreatorOnline();

            },
        },

    ];

    const onSelectNode = (value:string) => {
        setNodeName(value);
        nodeNo = value;
        getOpreatorList();
        setOpreatorId('');
    };

    const onSelectOpreator = (value: string) => {
        setOpreatorId(value);
    };

    const onClearOpreator = () => {
        setOpreatorId('');
    };

    useEffect(() => {
        getNodeTree();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleOpreatorOnlineMgnt']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={12}>

                    <Col span={4}>
                        <TreeSelect treeDefaultExpandAll style={{ width: '100%' }} value={nodeName} treeData={ nodeTree} onSelect={ onSelectNode}></TreeSelect>
                        {/* <Select style={{ width: '100%' }} value={nodeName} dropdownRender={() => (
                            <div>
                                <Tree
                                    defaultExpandAll={true}
                                    autoExpandParent={true}
                                    treeData={nodeTree}
                                    onSelect={ onSelectNode}
                                />
                            </div>
                        )}></Select> */}
                    </Col>
                    <Col span={4}>
                        <Select value={opreatorId} style={{ width: '100%' }} onSelect={onSelectOpreator} onClear={ onClearOpreator} allowClear>
                            {opreatorList.length && opreatorList.map((v: OpreatorData) => (
                                <Option value={v.OPERATOR_ID} key={v.OPERATOR_ID}>{v.OPERATOR_NAME}</Option>
                            )
                            )}
                        </Select>
                    </Col>

                    <Col span={4} className='flex flexBetween'>
                        <BtnList btnList={btnList} />

                    </Col>
                </Row>
                <div style={{paddingTop: '10px'}}>
                    <Table className='table' loading={loading} columns={detailColumns} rowKey='OPERATOR_ID'
                        dataSource={opreatorOnline} pagination={ false}
                    >
                    </Table>

                </div>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(OpreatorOnlineMgt);
