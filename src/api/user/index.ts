import {get, post} from 'src/api/http';
import * as types from './type';
import { TaskMess } from '../types';
class User {
    login (data: types.Login): Promise<any> { // 登陆
        return post('/login/sign', data);
    }
    logout (): Promise<string> {
        return post('/LoginOut');
    }
    setPassword (data:types.SetPassword): Promise<string> {
        return post('/set-password', data);
    }
    addUser (data: types.UserParams): Promise<TaskMess> { // 新增用户
        return post('/user/add', data);
    }
    editorUser (data: types.EditorUserParams): Promise<TaskMess> { // 编辑用户
        return post('/user/edit', data);
    }
    restPwd (data: types.RestPwdParams): Promise<string> { // 重置密码
        return post('/user/rest-pwd', data);
    }
    deleteUser (data: types.DeleteUserParams): Promise<string> { // 删除用户
        return post('/user/delete', data);
    }
    userList (data: types.UserListParams): Promise<types.UserList> { // 用户列表
        return get(`/user/list?subSysNo=${data.subSysNo}&sysNo=${data.sysNo}&page=${data.page}&rows=${data.rows}&operatorId=${data.operatorId}&operatorName=${data.operatorName}`);
    }
    async getComListJson () { // 根节点数据
        return [ {'NODE_NO': '0068', 'NODE_NAME': 'MDR System'} ];
    }
    userNodeTree (subSysNo:string): Promise<types.UserNode[]> { // 用户节点树，新增时的组织下拉选择
        return get(`/user/node-tree-by-login-user?subSysNo=${subSysNo}`);
    }
    userRoleList (subSysNo: string): Promise<types.UserRoleList[]> { // 角色列表，新增时选择角色下拉列表
        return get(`/user/sys-role-json?subSysNo=${subSysNo}`);
    }
    getRoleList (obj: types.RoleListQuery): Promise<types.RoleListData> { // 获取角色列表
        return get(`/role/list?sysNo=${obj.sysNo}&company=${obj.company}&page=${obj.page}&rows=${obj.rows}`);
    }
    deletRole (guid: string): Promise<TaskMess> { // 删除角色
        return post('/role/delete', {
            guid,
        });
    }
    sysModuleJson (subSysNo: string): Promise<types.menusList[]> { // 菜单树，新增时，展示菜单树
        return get(`/role/sys-module-json?subSysNo=${subSysNo}`);
    }
    addRole (params: types.AddRoleParams): Promise<TaskMess> { // 新增角色
        return post('/role/add', params);
    }
    curModuleJson (guid:string): Promise<types.curMenu[]> { // 当前角色选中的菜单树
        return get(`/role/cur-module-json?guid=${guid}`);
    }
    curModuleHomeJson (guid: string): Promise<types.curMenu[]> { // 当前角色选中的快捷菜单树
        return get(`/role/cur-module-home-json?guid=${guid}`);
    }
    editorRole (params: types.EditorRoleParams): Promise<TaskMess> { // 编辑角色
        return post('/role/edit', params);
    }
}

export default new User();
