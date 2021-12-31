// eslint-disable-next-line no-use-before-define
import React, { useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Tabs } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import SystemParamTab from './systemParam';
import CardItem, { CardItemData} from './cardItem';

type Props = {
    Mes: LangMessage;
};

const SystemParametersMgt: React.FC<Props> = (props) => {
    const { Mes } = props;
    const { TabPane } = Tabs;

    const [ javaParamList, setJavaParamList ] = useFetchState<CardItemData[]>([]);
    const [ operationParamList, setOperationParamList ] = useFetchState<CardItemData[]>([]);
    const [ memoryParamList, setMemoryParamList ] = useFetchState<CardItemData[]>([]);
    const [ cpuParamList, setCpuParamList ] = useFetchState<any[]>([]);
    const [ diskParamList, setDiskParamList ] = useFetchState<any[]>([]);
    const [ networkParamList, setNetworkParamList ] = useFetchState<any[]>([]);

    const getJavaParam = () => {
        configuration.systemParameters.getJavaParam().then((res) => {
            let items:CardItemData[] = [];

            Object.keys(res).map((v) => {
                let obj: CardItemData = {
                    label: v,
                    value: res[v],
                };

                items.push(obj);
            });
            setJavaParamList(items);
        });
    };

    const getServerParam = () => {
        configuration.systemParameters.getServerParam().then((res) => {
            // 获取operationParam
            let items:CardItemData[] = [];

            Object.keys(res.OperationSystemPara).map((v) => {
                let obj: CardItemData = {
                    label: v,
                    value: res.OperationSystemPara[v],
                };

                items.push(obj);
            });
            setOperationParamList(items);

            // 获取memoryParam
            let memorys:CardItemData[] = [];

            Object.keys(res.MemoryPara).map((v) => {
                let obj: CardItemData = {
                    label: v,
                    value: res.MemoryPara[v],
                };

                memorys.push(obj);
            });
            setMemoryParamList(memorys);

            // 获取cpuParam
            if (res.CpuPara.length > 0) {
                let cpuList = [];

                for (let i = 0; i < res.CpuPara.length; i++) {
                    let cpuInfo = res.CpuPara[i];
                    let cpus:CardItemData[] = [];

                    Object.keys(cpuInfo).map((v) => {
                        let obj: CardItemData = {
                            label: v,
                            value: cpuInfo[v],
                        };

                        cpus.push(obj);
                    });
                    cpuList.push(cpus);
                }
                setCpuParamList(cpuList);
            }

            // 获取diskParam
            if (res.HardDiskPara.length > 0) {
                let diskList = [];

                for (let i = 0; i < res.HardDiskPara.length; i++) {
                    let diskInfo = res.HardDiskPara[i];
                    let disks:CardItemData[] = [];

                    Object.keys(diskInfo).map((v) => {
                        let obj: CardItemData = {
                            label: v,
                            value: diskInfo[v],
                        };

                        disks.push(obj);
                    });
                    diskList.push(disks);
                }
                setDiskParamList(diskList);
            }

            // 获取networkParam
            if (res.NetworkPara.length > 0) {
                let networkList = [];

                for (let i = 0; i < res.NetworkPara.length; i++) {
                    let networkInfo = res.NetworkPara[i];
                    let networks:CardItemData[] = [];

                    Object.keys(networkInfo).map((v) => {
                        let obj: CardItemData = {
                            label: v,
                            value: networkInfo[v],
                        };

                        networks.push(obj);
                    });
                    networkList.push(networks);
                }
                setNetworkParamList(networkList);
            }
        });
    };

    useEffect(() => {
        getJavaParam();
        getServerParam();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['titleLabelMdrsysparammdrsysparam']}</h4>
            </div>
            <div className='pv10h20'>
                <Tabs defaultActiveKey='1' type='card' style={{paddingTop: '10px'}}>
                    <TabPane tab={Mes['titleLabelMdrsystemparamdrsystempara']} key='1' forceRender={ true}>
                        <SystemParamTab Mes={ Mes}/>
                    </TabPane>
                    <TabPane tab={Mes['titleLabelJavaparajavapara']} key='2' forceRender={ true}>
                        {javaParamList.length && (<CardItem list={ javaParamList}></CardItem>)}
                    </TabPane>
                    <TabPane tab={Mes['titleLabelOperationparaoperationpara']} key='3' forceRender={ true}>
                        {operationParamList.length && (<CardItem list={ operationParamList}></CardItem>)}
                    </TabPane>
                    <TabPane tab={Mes['titleLabelCpuparacpupara']} key='4' forceRender={ true}>
                        {cpuParamList.length && cpuParamList.map((v: CardItemData[], index) => (<CardItem key={ index} list={ v}></CardItem>))}
                    </TabPane>
                    <TabPane tab={Mes['titleLabelMemoryparamemorypara']} key='5' forceRender={ true}>
                        {memoryParamList.length && (<CardItem list={ memoryParamList}></CardItem>)}
                    </TabPane>
                    <TabPane tab={Mes['titleLabelHarddiskparaharddiskpara']} key='6' forceRender={ true}>
                        {diskParamList.length && diskParamList.map((v: CardItemData[], index) => (<CardItem key={ index} list={ v}></CardItem>))}
                    </TabPane>
                    <TabPane tab={Mes['titleLabelNetworkparanetworkpara']} key='7' forceRender={ true}>
                        {networkParamList.length && networkParamList.map((v: CardItemData[], index) => (<CardItem key={ index} list={ v}></CardItem>))}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
}))(SystemParametersMgt);
