/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-03 16:11:07
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import { get, post } from 'src/api/http';
import { GetLangRes, AddLangParams, GetLangList, ReturnLangList } from './type';

class Lang {
    // 获取资源包数据
    getLangResource (lang: string): Promise<GetLangRes> {
        return get(`/i18n/langeuage-resource?language=${lang}`);
    }
    // 添加国际化词条
    addLang (data: AddLangParams): Promise<AddLangParams> {
        return post('/i18n/langeuage-add', data);
    }
    // 获取语言列表
    getLangList (data: GetLangList): Promise<ReturnLangList> {
        return post('/i18n/langeuage-list', data);
    }
}

export default new Lang();

