/* eslint-disable react/display-name */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { LangMessage } from 'src/store/common/language';
import { message, Select, Row, Col, Input} from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration, basicData } from 'src/api';
import { DeviceSubType, CommandScheme, LeftCommandData, RightCommandData} from 'src/api/configuration/commandConfig/types';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import TransferTable, { CRef, PaginationConfig } from 'src/components/business/transfer';
import { ColumnsType } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';
import AddLangElment, { CRef as ARef } from 'src/components/business/addRowCom';
// import { SearchOutlined } from '@ant-design/icons';

type Props = {
    Mes: LangMessage;
};
let leftAllCommandList: LeftCommandData[] = [];
let rightAllCommandList: RightCommandData[] = [];
let delCommandList: RightCommandData[] = [];
const CommandStatePage: React.FC<Props> = (props) => {
    const { Mes } = props;
    const { Option } = Select;
    const { Search } = Input;
    const cRef = useRef<CRef>();
    const aRef = useRef<ARef>();
    const rows = 10;

    const [ leftCommandList, setLeftCommandList ] = useFetchState<LeftCommandData[]>([]);
    const [ rightCommandList, setRightCommandList ] = useFetchState<RightCommandData[]>([]);
    const [ deviceTypeList, setDeviceTypeList ] = useFetchState<DeviceSubType[]>([]);
    const [ schemeList, setSchemeList ] = useFetchState<CommandScheme[]>([]);
    const [ deviceType, setDeviceType ] = useFetchState<string>('Meter');
    const [ subType, setSubType ] = useFetchState<string>('');
    const [ commmandType, setCommandType ] = useFetchState<string>('Reading');
    const [ scheme, setScheme ] = useFetchState<string>('');
    const [ leftSearch, setLeftSearch ] = useFetchState<string>('');
    const [ rightSearch, setRightSearch ] = useFetchState<string>('');
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);

    // 过滤左边table的值
    const searchLeft = () => {
        let filters = leftAllCommandList.filter((v) => v.L_AFN_NAME.toLowerCase().includes(leftSearch.toLowerCase()) || v.L_AFN.toLowerCase().includes(leftSearch.toLowerCase()) ||
        v.L_FN.toLowerCase().includes(leftSearch.toLowerCase()));
        // const leftCurrent = cRef.current?.getLeftCurrent() || 1;
        const leftCurrent = 1;

        cRef.current?.setLeftData({
            rows: filters.slice(leftCurrent - 1, rows),
            total: filters.length,
        });
        setLeftCommandList(filters);
        cRef.current?.setLeftCurrent(leftCurrent);
    };

    // 过滤右边table的值
    const searchRight = () => {
        let filters = rightAllCommandList.filter((v) => v.R_AFN_NAME.toLowerCase().includes(rightSearch.toLowerCase()) || v.R_AFN.toLowerCase().includes(rightSearch.toLowerCase()) ||
        v.R_FN.toLowerCase().includes(rightSearch.toLowerCase()));
        // const rightCurrent = cRef.current?.getRightCurrent() || 1;
        const rightCurrent = 1;

        cRef.current?.setRightData({
            rows: filters.slice(rightCurrent - 1, rows),
            total: filters.length,
        });
        setRightCommandList(filters);
        cRef.current?.setRightCurrent(rightCurrent);
    };

    const changeSearchLeft = (e:any) => {
        setLeftSearch(e.target.value);
    };

    const changeSearchRight = (e:any) => {
        setRightSearch(e.target.value);
    };

    // // 左边table搜索
    // const handleLeftSearch = (selectedKeys:any, confirm: any, dataIndex:string) => {
    //     confirm();
    //     let filters = leftAllCommandList.filter((v) => v[dataIndex].toLowerCase().includes(selectedKeys[0].toString().toLowerCase()));
    //     const leftCurrent = cRef.current?.getLeftCurrent() || 1;

    //     cRef.current?.setLeftData({
    //         rows: filters.slice(leftCurrent - 1, rows),
    //         total: filters.length,
    //     });
    //     setLeftCommandList(filters);
    // };

    // // 左边table自定义搜索框
    // const getLeftColumnSearchProps = (dataIndex:string) => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm}: any) => (
    //         <div style={{ padding: 8 }}>
    //             <Search
    //                 placeholder='Search'
    //                 value={selectedKeys[0]}
    //                 onChange={(e) => setSelectedKeys(e.target.value ? [ e.target.value ] : [ '' ])}
    //                 onSearch={() => handleLeftSearch(selectedKeys, confirm, dataIndex)}
    //                 style={{ marginBottom: 8, display: 'block' }}
    //                 enterButton
    //             />
    //         </div>
    //     ),
    //     filterIcon: (filtered:boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    //     onFilter: (value: any, record: LeftCommandData) =>
    //         record[dataIndex]
    //             ? record[dataIndex].toString().toLowerCase()
    //                 .includes(value.toLowerCase())
    //             : ''
    //     ,
    // });

    // // 右边table搜索
    // const handleRightSearch = (selectedKeys:any, confirm: any, dataIndex:string) => {
    //     confirm();
    //     let filters = rightAllCommandList.filter((v) => v[dataIndex].toLowerCase().includes(selectedKeys[0].toString().toLowerCase()));
    //     const rightCurrent = cRef.current?.getRightCurrent() || 1;

    //     cRef.current?.setRightData({
    //         rows: filters.slice(rightCurrent - 1, rows),
    //         total: filters.length,
    //     });
    //     setRightCommandList(filters);
    // };

    // const getRightColumnSearchProps = (dataIndex:string) => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm}: any) => (
    //         <div style={{ padding: 8 }}>
    //             <Search
    //                 placeholder='Search'
    //                 value={selectedKeys[0]}
    //                 onChange={(e) => setSelectedKeys(e.target.value ? [ e.target.value ] : [ '' ])}
    //                 onSearch={() => handleRightSearch(selectedKeys, confirm, dataIndex)}
    //                 style={{ marginBottom: 8, display: 'block' }}
    //                 enterButton
    //             />
    //         </div>
    //     ),
    //     filterIcon: (filtered:boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    //     onFilter: (value: any, record: RightCommandData) =>
    //         record[dataIndex]
    //             ? record[dataIndex].toString().toLowerCase()
    //                 .includes(value.toLowerCase())
    //             : ''
    //     ,
    // });

    // 左边表单配置
    const leftColumns: ColumnsType<LeftCommandData> = [
        {
            title: 'Name',
            dataIndex: 'L_AFN_NAME',
            // ...getLeftColumnSearchProps('L_AFN_NAME'),
        },
        {
            title: 'Code',
            dataIndex: 'L_AFN',
            // ...getLeftColumnSearchProps('L_AFN'),
        },
        {
            title: 'Sub Code',
            dataIndex: 'L_FN',
        },
    ];
    // 右边表单配置
    const rightColumns: ColumnsType<RightCommandData> = [
        {
            title: 'Name',
            dataIndex: 'R_AFN_NAME',
            // ...getRightColumnSearchProps('R_AFN_NAME'),
        },
        {
            title: 'Code',
            dataIndex: 'R_AFN',
            // ...getRightColumnSearchProps('R_AFN'),
        },
        {
            title: 'Sub Code',
            dataIndex: 'R_FN',
        },
        {
            title: 'Scheme Name',
            dataIndex: 'SCHEME_NAME',
        },
    ];
    // 左边数据获取
    const leftGetData = async (page: PaginationConfig, query: any = {}, flag = false, removes:LeftCommandData[] = []): Promise<any> => {
        let leftList = [ ...leftCommandList ];

        if (removes.length > 0) {// 删除右移过去的数据
            removes.map((v) => {leftList.splice(leftList.findIndex((item) => item.SN === v.SN), 1);});
            setLeftCommandList(leftList);
        }
        if (!flag) {// 分页
            cRef.current?.setLeftLoading(true);
            const rowsData = leftList.slice((page.page - 1) * page.pageSize, page.pageSize * page.page);

            cRef.current?.setLeftData({
                total: leftList.length,
                rows: rowsData,
            });
            cRef.current?.setLeftLoading(false);
            return {
                total: leftList.length,
                rows: rowsData,
            };
        } else {// 网络请求刷新
            cRef.current?.setLeftLoading(true);
            setLeftSearch('');
            let res = await configuration.commandConfig.getLeftCommandList(query);

            setLeftCommandList(res);
            leftAllCommandList = res;
            cRef.current?.setLeftCurrent(1);
            const rowsData = res.slice((page.page - 1) * page.pageSize, page.pageSize * page.page);

            cRef.current?.setLeftData({
                total: res.length,
                rows: rowsData,
            });
            cRef.current?.setLeftLoading(false);
            return {
                total: res.length,
                rows: rowsData,
            };
        }
    };
    // 右边table数据获取
    const rightGetData = async (page: PaginationConfig, query: any = {}, flag = false, removes: RightCommandData[] = []): Promise<any> => {
        let rightList = [ ...rightCommandList ];

        if (removes.length > 0) {
            removes.map((v) => {rightList.splice(rightList.findIndex((item) => item.SN === v.SN), 1);});
            setRightCommandList(rightList);
        }
        if (!flag) {// 分页
            cRef.current?.setRightLoading(true);
            const rowsData = rightList.slice((page.page - 1) * page.pageSize, page.pageSize * page.page);

            cRef.current?.setRightData({
                total: rightList.length,
                rows: rowsData,
            });
            cRef.current?.setRightLoading(false);
            return {
                total: rightList.length,
                rows: rowsData,
            };
        } else {// 刷新，接口获取
            cRef.current?.setRightLoading(true);
            setRightSearch('');
            let res = await configuration.commandConfig.getRightCommandList(query);

            setRightCommandList(res);
            rightAllCommandList = res;
            cRef.current?.setRightCurrent(1);
            const rowsData = res.slice((page.page - 1) * page.pageSize, page.pageSize * page.page);

            cRef.current?.setRightData({
                total: res.length,
                rows: rowsData,
            });
            cRef.current?.setRightLoading(false);
            return {
                total: res.length,
                rows: rowsData,
            };
        }
    };

    // 获取设备型号列表
    const getDeviceTypeList = (device:string, schemeName:string) => {
        configuration.commandConfig.getDeviceSubTypeList(device).then((res) => {
            setDeviceTypeList(res);
            if (res.length > 0) {
                setSubType(res[0].DEVICE_SUB_TYPE);
                leftGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: res[0].DEVICE_SUB_TYPE, commandType: commmandType, schemeName: schemeName}, true);
                rightGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: res[0].DEVICE_SUB_TYPE, commandType: commmandType, schemeName: schemeName}, true);
            }
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 获取命令方案列表
    const getSchemeList = () => {
        configuration.commandConfig.getCommandSchemeList().then((res) => {
            setSchemeList(res);
            if (res.length > 0) {
                setScheme(res[0].SCHEME_NAME);
                getDeviceTypeList(deviceType, res[0].SCHEME_NAME);
            } else {
                message.warn(Mes['messageAlarmCreateschemecreatescheme']);
                // getDeviceTypeList(deviceType, scheme);
            }
        });
    };

    // 新增命令方案
    const addCommandScheme = async (row: any): Promise<any> => {

        const params = {
            schemeName: row.schemeName,
            enabled: row.enabled,
        };

        basicData.commandScheme.addCommand(params).then(() => {
            getSchemeList();
            message.success(Mes['messageSuccessSavesuccesssavesuccess']);
        })
            .catch((err) => {
                message.error(err);
            });

    };

    // 弹窗显示新增命令方案
    const showAddModal = () => {
        let val:any = {};

        val = {
            schemeName: '',
            enabled: '1',
        };

        aRef.current?.openModel(val);
    };

    // 保存左移右移的结果
    const saveSetting = () => {
        if (!scheme) {
            message.warn(Mes['messageAlarmCreateschemecreatescheme']);
            return;
        }
        let list:any[] = [];

        rightCommandList.map((v) => {
            let obj = {
                SN: v.SN,
                AFN_NAME: v.R_AFN_NAME,
            };

            list.push(obj);
        });
        console.log(list, delCommandList);
        let params = {
            commandsnlist: JSON.stringify(list),
            commanddellist: JSON.stringify(delCommandList),
            deviceType: deviceType,
            deviceSubType: subType,
            commandType: commmandType,
            schemeName: scheme,
        };

        configuration.commandConfig.saveCommand(params).then(() => {
            message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            leftGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: subType, commandType: commmandType, schemeName: scheme}, true);
            rightGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: subType, commandType: commmandType, schemeName: scheme}, true);
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // button列表配置
    const btnList: BtnConfig[] = [
        {
            type: 'Save',
            btnType: 'primary',
            title: Mes['btnSavesave'],
            onClick () {
                saveSetting();
            },
        },
        {
            type: 'Add',
            btnType: 'primary',
            title: Mes['btnAddcommandschemeaddcommandscheme'],
            onClick () {
                showAddModal();
            },
        },
    ];

    // 下拉列表切换设备类型
    const onSelectDeviceType = (value: string) => {
        setDeviceType(value);
        getDeviceTypeList(value, scheme);
    };

    const onSelectSubType = (value: string) => {
        setSubType(value);
        leftGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: value, commandType: commmandType, schemeName: scheme}, true);
        rightGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: value, commandType: commmandType, schemeName: scheme}, true);
    };

    const onSelectCommandType = (value: string) => {
        setCommandType(value);

        leftGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: subType, commandType: value, schemeName: scheme}, true);
        rightGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: subType, commandType: value, schemeName: scheme}, true);
    };

    const onSelectScheme = (value: string) => {
        setScheme(value);
        leftGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: subType, commandType: commmandType, schemeName: value}, true);
        rightGetData({ page: 1, pageSize: rows }, {deviceType: deviceType, deviceSubType: subType, commandType: commmandType, schemeName: value}, true);
    };

    // 左移
    const btnL = (keys?:string[]) => {
        // 获取右边选择数据key
        const rightSelectedRowKeys = keys ? keys : cRef.current?.getRightSelectKeysList() as Key[];

        if (rightSelectedRowKeys.length) {
        // 获取左边列表数据
            const rightList = cRef.current?.getRightTableData() as RightCommandData[];
            // 获取右边需要左移的数据
            const rightSelectData = rightList.filter((v) => rightSelectedRowKeys.includes(v.SN));
            // let leftMoveData:any[] = [];
            let leftList = [ ...leftCommandList ];

            rightSelectData.map((v) => {
                let obj:LeftCommandData = {
                    L_AFN: v.R_AFN,
                    L_AFN_NAME: v.R_AFN_NAME,
                    L_FN: v.R_FN,
                    SN: v.SN,
                };

                // leftMoveData.push(obj);
                delCommandList.push(v);
                leftList.unshift(obj);
            });
            // 获取左边当前分页
            const leftCurrent = cRef.current?.getLeftCurrent() || 1;
            // 获取左边Table数据
            // const gainLeftData = cRef.current?.getLeftTableData() || [];
            // 设置左边数据，将移动数据放入左边table中

            cRef.current?.setLeftData({
                rows: leftList.slice(leftCurrent - 1, rows),
                total: leftList.length,
            });
            setLeftCommandList(leftList);

            // 清空右边选择
            cRef.current?.setRightSelectKeysList([]);
            // 获取右边当前分页
            const rightCurrent = cRef.current?.getRightCurrent() || 1;

            rightGetData({ page: rightCurrent, pageSize: rows }, {}, false, rightSelectData);
        }
    };

    // 右移
    const btnR = (keys?:string[]) => {
        // 获取左边选择数据key
        const leftSelectedRowKeys = keys ? keys : cRef.current?.getLeftSelectKeysList() as Key[];

        if (leftSelectedRowKeys.length) {
        // 获取左边列表数据
            const leftList = cRef.current?.getLeftTableData() as LeftCommandData[];

            const leftSelectData = leftList.filter((v) => leftSelectedRowKeys.includes(v.SN));
            // let rightMoveData:any[] = [];
            let rightList = [ ...rightCommandList ];

            leftSelectData.map((v) => {
                let obj:RightCommandData = {
                    R_AFN: v.L_AFN,
                    R_AFN_NAME: v.L_AFN_NAME,
                    R_FN: v.L_FN,
                    SN: v.SN,
                    SCHEME_NAME: scheme,
                };

                // rightMoveData.push(obj);
                rightList.push(obj);
            });
            // 获取右边当前分页
            const rightCurrent = cRef.current?.getRightCurrent() || 1;
            // 获取右边Table数据
            // const gainRightData = cRef.current?.getRightTableData() || [];
            // 设置右边数据，将移动数据放入右边table中

            cRef.current?.setRightData({
                rows: rightList.slice(rightCurrent - 1, rows),
                total: rightList.length,
            });
            setRightCommandList(rightList);

            // 清空左边选择
            cRef.current?.setLeftSelectKeysList([]);
            // 获取左边当前分页
            const leftCurrent = cRef.current?.getLeftCurrent() || 1;

            leftGetData({ page: leftCurrent, pageSize: rows }, {}, false, leftSelectData);
        }
    };

    // 全部左移
    const btnLL = () => {
        // 获取左边列表数据
        const rightList = cRef.current?.getRightTableData() as RightCommandData[];
        // let leftMoveData:any[] = [];
        let leftList = [ ...leftCommandList ];

        rightList.map((v) => {
            let obj:LeftCommandData = {
                L_AFN: v.R_AFN,
                L_AFN_NAME: v.R_AFN_NAME,
                L_FN: v.R_FN,
                SN: v.SN,
            };

            delCommandList.push(v);
            // leftMoveData.push(obj);
            leftList.unshift(obj);
        });
        // 获取左边当前分页
        const leftCurrent = cRef.current?.getLeftCurrent() || 1;
        // 获取左边Table数据
        // const gainLeftData = cRef.current?.getLeftTableData() || [];
        // 设置左边数据，将移动数据放入左边table中

        cRef.current?.setLeftData({
            rows: leftList.slice(leftCurrent - 1, rows),
            total: leftList.length,
        });
        setLeftCommandList(leftList);

        // 清空右边选择
        cRef.current?.setRightSelectKeysList([]);
        // 获取右边当前分页
        const rightCurrent = cRef.current?.getRightCurrent() || 1;

        rightGetData({ page: rightCurrent, pageSize: rows }, {}, false, rightList);
    };

    // 全部右移
    const btnRR = () => {
        // 获取左边列表数据
        const leftList = cRef.current?.getLeftTableData() as LeftCommandData[];
        // let rightMoveData:any[] = [];

        let rightList = [ ...rightCommandList ];

        leftList.map((v) => {
            let obj:RightCommandData = {
                R_AFN: v.L_AFN,
                R_AFN_NAME: v.L_AFN_NAME,
                R_FN: v.L_FN,
                SN: v.SN,
                SCHEME_NAME: scheme,
            };

            // rightMoveData.push(obj);
            rightList.push(obj);
        });
        // 获取右边当前分页
        const rightCurrent = cRef.current?.getRightCurrent() || 1;
        // 获取右边Table数据
        // const gainRightData = cRef.current?.getRightTableData() || [];
        // 设置右边数据，将移动数据放入右边table中

        cRef.current?.setRightData({
            rows: rightList.slice(rightCurrent - 1, rows),
            total: rightList.length,
        });
        setRightCommandList(rightList);
        // 清空左边选择
        cRef.current?.setLeftSelectKeysList([]);
        // 获取左边当前分页
        const leftCurrent = cRef.current?.getLeftCurrent() || 1;

        leftGetData({ page: leftCurrent, pageSize: rows }, {}, false, leftList);
    };

    // 弹窗form组件配置
    const addOpt = [
        {
            type: 'Input',
            label: 'titleTableSchemenameschemename',
            name: 'schemeName',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

        {
            type: 'Select',
            label: 'comboboxEnabledenabled',
            name: 'enabled',
            rules: [ { required: true } ],
            col: 20,
            options: [ { name: 'YES', value: '1' }, {name: 'NO', value: '0'} ],
        },

    ];

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    // 弹窗参数设置
    const modelOpt = {
        title: 'btnAddcommandschemeaddcommandscheme',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 弹窗表单参数
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    useEffect(() => {
        getSchemeList();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 400);
    }, []);

    return (<div style={{height: '100%'}}>
        <Row gutter={20}>

            <Col span={4}>
                <Select value={deviceType} style={{ width: '100%' }} onSelect={ onSelectDeviceType}>
                    <Option value='Meter'>Meter</Option>
                    <Option value='DCU'>DCU</Option>
                </Select>
            </Col>
            <Col span={4}>
                <Select value={subType} style={{ width: '100%' }} onSelect={ onSelectSubType}>
                    {deviceTypeList && deviceTypeList.map((v: DeviceSubType) => (<Option key={ v.DEVICE_SUB_TYPE} value={ v.DEVICE_SUB_TYPE}>{ v.DEVICE_SUB_TYPE_NAME}</Option>))}
                </Select>
            </Col>
            <Col span={4}>
                <Select value={commmandType} style={{ width: '100%' }} onSelect={ onSelectCommandType}>
                    <Option value='read'>Reading</Option>
                    <Option value='set'>Setting</Option>
                </Select>
            </Col>
            <Col span={4}>
                <Select value={scheme} style={{ width: '100%' }} onSelect={ onSelectScheme}>
                    {schemeList && schemeList.map((v: CommandScheme) => (<Option key={ v.SCHEME_NAME} value={ v.SCHEME_NAME}>{ v.SCHEME_NAME}</Option>))}
                </Select>
            </Col>
            <Col span={4} className='flex flexBetween'>
                <BtnList btnList={btnList} />

            </Col>
        </Row>
        <div style={{marginTop: '10px', height: '100%'}}>
            <TransferTable<LeftCommandData, RightCommandData>
                rowKey={'SN'}
                leftColumns={leftColumns}
                rightColums={rightColumns}
                leftGetData={leftGetData}
                rightGetData={rightGetData}
                scrollY={ tableHeight}
                rows={rows}
                cRef={cRef}
                LeftSolt={(<Row>
                    <Col span={ 8}><h4 style={{ marginLeft: '10px' }}>Disable Command List</h4></Col>
                    <Col span={ 8}></Col>
                    <Col span={8}><Search placeholder='Search' enterButton onSearch={searchLeft} value={leftSearch} onChange={ changeSearchLeft}></Search></Col>
                </Row>)}
                RightSolt={ (<Row>
                    <Col span={ 8}><h4 style={{ marginLeft: '10px' }}>Enable Command List</h4></Col>
                    <Col span={ 8}></Col>
                    <Col span={ 8}><Search placeholder='Search' enterButton onSearch={ searchRight} value={ rightSearch} onChange={ changeSearchRight}></Search></Col>
                </Row>)}
                btnEvent={{
                    btnL: btnL,
                    btnR: btnR,
                    btnLL: btnLL,
                    btnRR: btnRR,
                }}
            />
        </div>
        <AddLangElment
            cRef={aRef}
            saveData={addCommandScheme}
            formOption={formOpt}
            modelOpt={modelOpt}
            Mes={Mes}
        />
    </div>);
};


export default CommandStatePage;
