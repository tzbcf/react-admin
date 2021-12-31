import {post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class CommandSchemeMgt {
    commandList (params: types.CommandParams): Promise<types.CommandList> {
        return post('/command/getSchemeList', params);
    }

    addCommand (params: types.UpdateCommand): Promise<TaskMess> {
        return post('/command/addScheme', params);
    }

    updateCommand (params: types.UpdateCommand): Promise<TaskMess> {
        return post('/command/updateScheme', params);
    }

    deleteCommand (params: any): Promise<TaskMess> {
        return post('/command/delScheme', params);
    }
}

export default new CommandSchemeMgt();
