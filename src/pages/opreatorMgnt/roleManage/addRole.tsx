/*
 * FileName : addRole.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-03 10:35:16
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle } from 'react';
import { Modal, Button, Form, Input, Checkbox, Row, Col, Tree, message } from 'antd';
import { LangMessage } from 'src/store/common/language';
import {ReturnUser} from 'src/api/user/type';
import { DataNode } from 'rc-tree/lib/interface';
import routerConfig from 'src/router/menuRouter';
import { RouterConfig } from 'src/router/types';
import { connect } from 'react-redux';
import { user } from 'src/api';
import { AddRoleParams, RoleListRow, curMenu } from 'src/api/user/type';
import useFetchState from 'src/utils/useFetchState';
import '../index.less';
export interface CRef {
  openModel(value?:RoleListRow): void;
  closeModel(): void;
}

type ApiMenuData = {
    NAME: string;
    NO: string;
    PNO: string;
    menuKey: string;
}

type Props = {
    cRef: React.MutableRefObject<CRef | undefined>;
    Mes: LangMessage;
    User: ReturnUser;
    onFinish?: () => void;
}

interface TreeData extends DataNode{
    key: string;
    title: string;
    no: string;
    children?: TreeData[];
}

// const menuFormatTree = (router: RouterConfig[], mes: LangMessage): DataNode[] => router.filter((v: RouterConfig) => !v.key.includes('HomePage')).map((v: RouterConfig) => ({
//     title: mes[v.title],
//     key: v.key,
//     children: v.subs && menuFormatTree(v.subs, mes),
// }));

// tree选中时，右边展示已选中菜单
const treeDataFormatCheck = (treeList: DataNode[], checkNode: React.Key[], list: DataNode[]) => {
    treeList.forEach((v: DataNode) => {
        if (!v.children) {
            const isCheckItem = checkNode.find((key: React.Key) => key === v.key);

            if (isCheckItem) {
                list.push(v);
            }
        } else {
            treeDataFormatCheck(v.children, checkNode, list);
        }
    });
};

// 接口返回的数据转换为tree树的数据格式
const menuFormatData = (menu: ApiMenuData[], list: TreeData[]) => {
    menu.forEach((item: ApiMenuData) => {
        if (item.PNO) {
            const itemParent = list.find((v: TreeData) => v.no === item.PNO);

            if (itemParent) {
                itemParent.children?.push({
                    key: item.menuKey,
                    no: item.NO,
                    title: item.NAME,
                });
            } else {
                const parentItem = menu.find((v: ApiMenuData) => v.NO === item.PNO);

                if (parentItem) {
                    const listItem: TreeData = {
                        key: parentItem.menuKey,
                        title: parentItem.NAME,
                        no: parentItem.NO,
                        children: [],
                    };

                    listItem.children?.push({
                        key: item.menuKey,
                        no: item.NO,
                        title: item.NAME,
                    });
                    list.push(listItem);
                }
            }
        } else {
            const itemParent = list.find((v: TreeData) => v.key === item.menuKey);

            if (!itemParent) {
                list.push({
                    key: item.menuKey,
                    title: item.NAME,
                    no: item.NO,
                    children: [],
                });
            }
        }
    });
};

// 判断获取的菜单本地是否存在
const menuDataFormatTree = (menu: RouterConfig[], tree:TreeData[]) => tree.map((v: TreeData) => {
    const menuItem = menu.find((o: RouterConfig) => v.key === o.key);

    if (menuItem && menuItem.subs && v.children) {
        menuDataFormatTree(menuItem.subs, v.children);
        return v;
    }
}).filter((v: TreeData | undefined) => v);

// 获取菜单id
const gianMenuNO = (tree: TreeData[], keyList:React.Key[], noList: string[]) => tree.map((v: TreeData) => {
    const item = keyList.find((o: React.Key) => o === v.key);

    if (item) {
        noList.push(v.no);
    }
    if (v.children && v.children.length) {
        gianMenuNO(v.children, keyList, noList);
    }

});

// 选中菜单Id转换成key
const idListFormatTreeList = (idList: curMenu[], treeList: TreeData[], quickList: TreeData[]): void => {
    treeList.forEach((v: TreeData) => {
        if (v.children && v.children.length) {
            idListFormatTreeList(idList, v.children, quickList);
        } else {
            for (let i = 0; i < idList.length; i++) {
                if (v.no === idList[i].NO) {
                    quickList.push(v);
                }
            }
        }
    });
};

// 表单初始化
// const INITFORM = {
//     roleName: '',
//     Remark: '',
//     remember: false,
// };

const AddRole: React.FC<Props> = (props) => {
    const { cRef, Mes, onFinish, User } = props;
    let menus: RouterConfig[] = [];
    const [ form ] = Form.useForm();

    Object.keys(routerConfig).map((key: string) => {
        menus = menus.concat(routerConfig[key]);
    });

    // modal弹窗
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    // 按钮loading
    const [ btnLoading, setBtnLoading ] = useFetchState<boolean>(false);
    // 菜单树数据
    const [ treeData, setTreeData ] = useFetchState<TreeData[]>([]);
    // 快捷菜单数据
    const [ quickData, setQuickData ] = useFetchState<TreeData[]>([]);
    // 菜单树选中
    const [ checkedKeys, setCheckedKeys ] = useFetchState<React.Key[]>([]);
    // 快捷菜单选中
    const [ checkBoxKeys, setCheckBoxKeys ] = useFetchState<string[]>([]);
    // 是否编辑
    const [ guid, setGuid ] = useFetchState<string>('');
    // 提交
    const handleOk = async () => {
        try {
            setBtnLoading(true);
            if (!quickData.length) {
                setBtnLoading(false);
                return message.warn(Mes['warnRoleMinMenu']);
            }
            if (!checkBoxKeys.length) {
                setBtnLoading(false);
                return message.warn(Mes['warnMinShortcutMenu']);
            }
            if (checkBoxKeys.length > 6) {
                setBtnLoading(false);
                return message.warn(Mes['warnMaxShortcutMenu']);
            }
            const res = await form.validateFields();

            const meanuNo: string[] = [];

            gianMenuNO(treeData, checkedKeys, meanuNo);
            const meanuNoCommonUsed: string[] = [];

            gianMenuNO(quickData, checkBoxKeys, meanuNoCommonUsed);
            const params: AddRoleParams = {
                'sys_no': User.sysType.substring(0, 2),
                'company_no': User.sysUser.nodeNo,
                'role_name': res.roleName,
                'role_rmk': res.Remark,
                'allupdate': res.remember ? '1' : '0',
                'allupdate_box': res.remember && 'on',
                'subSysNo': User.sysType,
                'meanu_no': meanuNo.join(','),
                'meanu_no_commonUsed': meanuNoCommonUsed.join(','),
            };

            if (!guid) {
                await user.addRole(params);
            } else {
                await user.editorRole({...params, guid: guid});
            }
            message.success(Mes['titleTableSuccesssuccess']);
            onFinish && onFinish();
            setBtnLoading(false);
            setModalVisible(false);
        } catch (error: any) {
            message.error(typeof error === 'string' ? error : Mes['messageErrorSavefailuresavefailure']);
            setBtnLoading(false);
        }
    };

    // 关闭
    const handleCancel = () => {
        if (!btnLoading) {
            setBtnLoading(false);
            setModalVisible(false);
        }
    };

    // 从后台获取菜单
    const getMenu = async (value?: RoleListRow) => { // value=guid,没有代表添加，有代表修改
        if (!value) {
            setGuid('');
            const res = await user.sysModuleJson(User.sysType);

            // 将后台获取菜单转换成本地菜单格式
            const menuList: TreeData[] = [];

            menuFormatData(res, menuList);
            const gainTreeData = menuDataFormatTree(menus, menuList);

            setTreeData(gainTreeData as TreeData[]);
        } else {
            // 设置编辑默认数据
            form.setFieldsValue({
                roleName: value.GROUP_NAME,
                Remark: value.REMARK,
                remember: Boolean(parseInt(value.GLOBE_MODIFY_FLAG, 10)),
            });
            setGuid(value.GROUP_GUID);
            // 获取菜单，选中菜单，快捷菜单
            const res = await Promise.all([ user.sysModuleJson(User.sysType), user.curModuleJson(value.GROUP_GUID), user.curModuleHomeJson(value.GROUP_GUID) ]);
            // 转换获取菜单为本地菜单格式
            const menuList: TreeData[] = [];

            menuFormatData(res[0], menuList);
            const gainTreeData = menuDataFormatTree(menus, menuList);

            setTreeData(gainTreeData as TreeData[]);
            // 转换选中菜单为本地菜单格式
            const quickList: TreeData[] = [];

            idListFormatTreeList(res[1], gainTreeData as TreeData[], quickList);
            setQuickData(quickList);
            // 设置tree默认选中菜单
            const keyList = quickList.map((v:TreeData): React.Key => v.key);

            setCheckedKeys(keyList);
            // 转换快捷菜单为本地菜单格式
            const checkBoxKeyList: TreeData[] = [];

            idListFormatTreeList(res[2], quickList, checkBoxKeyList);
            // 设置默认选中格式
            const checkKeyList: string[] = checkBoxKeyList.map((v: TreeData): string => v.key);

            setCheckBoxKeys(checkKeyList);
        }
    };

    // 暴露给父级调用的方法
    useImperativeHandle(cRef, () => ({
        async openModel (value?: RoleListRow) {
            await getMenu(value).then(() => {
                setModalVisible(true);
            });
        },
        closeModel () {
            handleCancel();
        },
    }));
    // 菜单树选中菜单，右边展示快捷菜单数据供展示
    const onTreeCheck = (checked: { checked: React.Key[]; halfChecked: React.Key[]; } | React.Key[]) => {
        const quickList: any[] = [];

        treeDataFormatCheck(treeData, checked as React.Key[], quickList);
        setQuickData(quickList);
        setCheckedKeys(checked as React.Key[]);
    };

    // 快捷菜单选中
    const checkEvent = (value: (string | number | boolean)[]) => {
        setCheckBoxKeys(value as string[]);
    };

    // 关闭后销毁数据
    const afterClose = () => {
        setTreeData([]);
        setQuickData([]);
        setCheckedKeys([]);
        setCheckBoxKeys([]);
        form.resetFields();
    };

    return (
        <Modal
            visible={modalVisible}
            title={ !guid ? Mes['titleDialogAddroleaddrole'] : Mes['titleDialogEditroleeditrole']}
            destroyOnClose={true}
            onOk={handleOk}
            onCancel={handleCancel}
            afterClose={afterClose}
            width={600}
            className='addRoleModal'
            footer={[
                <Button key='back' loading={btnLoading} onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
                <Button key='submit' type='primary' loading={btnLoading} onClick={handleOk}>{ Mes['btnSubmit'] }</Button>,
            ]}
        >
            <Form
                name='addRole'
                form={form}
                preserve={false}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
            >
                <Form.Item
                    label={Mes['titleLabelRolenamerolename']}
                    name='roleName'
                    rules={[
                        {
                            required: true,
                            message: Mes['messageHintNotempty0notempty0'],
                        },
                        {
                            max: 40,
                            message: Mes['hintRulesMaxBytes']?.replace('*', '40'),
                        },
                        {
                            min: 1,
                            message: Mes['hintRulesMinBytes']?.replace('*', '1'),
                        },
                    ]}
                >
                    <Input autoComplete='new-password' />
                </Form.Item>
                <Form.Item
                    label={Mes['titleLabelRemarkremark']}
                    name='Remark'
                    rules={[
                        {
                            max: 100,
                            message: Mes['hintRulesMaxBytes']?.replace('*', '100'),
                        },
                    ]}
                >
                    <Input autoComplete='new-password' />
                </Form.Item>
                <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 5, span: 19 }}>
                    <Checkbox>{ Mes['titleLabelWeihuweihu'] }</Checkbox>
                </Form.Item>
            </Form>
            <Row gutter={24} className='menu-tree'>
                <Col span={12}>
                    <p>{Mes['titleLabelMeanumeanu']}</p>
                    <div className='scrollbar'>
                        <Tree
                            checkable
                            checkedKeys={checkedKeys}
                            onCheck={onTreeCheck}
                            treeData={treeData}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <p>{Mes['titleLabelShortcutmenushortcutmenu']}</p>
                    <div className='scrollbar'>
                        <Checkbox.Group onChange={checkEvent} defaultValue={checkBoxKeys}>
                            {
                                quickData.map((v: any) => (
                                    <div key={v.key}>
                                        <Checkbox value={v.key}>{ v.title }</Checkbox>
                                    </div>
                                ))}
                        </Checkbox.Group>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    User: state.userInfo,
}))(AddRole);

