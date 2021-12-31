/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Input, message, Table} from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { SystemParamList, SystemParamData } from 'src/api/configuration/systemParametersMgnt/types';

type Props = {
    Mes: LangMessage;
};
let ROWS = 10;
let setParamObj = {};
const SystemParamTab:React.FC<Props> = (props:Props) => {
    const { Mes } = props;

    const [ systemParamList, setSystemParamList ] = useFetchState<SystemParamData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);

    const changeInputValue = (e: any) => {
        const { value, id } = e.target;

        setParamObj[id] = value;
    };

    const inputValueFinish = () => {
        Object.keys(setParamObj).map((v) => {
            let value = setParamObj[v];
            let params = {
                sn: v,
                parameter_VALUE: value,
            };

            configuration.systemParameters.setSystemParam(params).then(() => {
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            });
        });
        setParamObj = {};
    };

    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 100,
        },
        {
            title: Mes['mdrSysParamTabParameterkeyparameterkey'],
            dataIndex: 'PARAMETER_KEY',
        },
        {
            title: Mes['titleTableProtocolnameprotocolname'],
            dataIndex: 'PARAMETER_NAME',
        },
        {
            title: Mes['titleTableProtocolvalueprotocolvalue'],
            dataIndex: 'PARAMETER_VALUE',
            width: 400,
            editable: true,
            render (_: any, record: SystemParamData) {
                return (
                    <>
                        <Input style={{width: '300px'}} id={ record.SN} defaultValue={record.PARAMETER_VALUE} onChange={changeInputValue} onBlur={ inputValueFinish}></Input>
                    </>
                );
            },
        },
        {
            title: Mes['mdrSysParamTabParameterdescriptionparameterdescription'],
            dataIndex: 'PARAMETER_DESCRIPTION',
        },
    ];

    const getSystemParamList = (page: number = 1) => {
        setLoading(true);
        configuration.systemParameters.getSystemParam(page, ROWS).then((res: SystemParamList) => {
            setLoading(false);
            setSystemParamList(res.rows);
            setTotal(res.total);
            setCurrent(page);
        })
            .catch((err) => {
                setLoading(false);
                message.error(err);
            });
    };

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            ROWS = pageSize!;
            getSystemParamList(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    useEffect(() => {
        getSystemParamList();
    }, []);

    return (<>

        <div id={'table'}>
            <Table columns={detailColumns} style={{ width: '100%' }} rowKey='SN' className='table' dataSource={systemParamList} loading={loading}
                pagination={ pagination} ></Table>
        </div>

    </>);
};

export default SystemParamTab;
