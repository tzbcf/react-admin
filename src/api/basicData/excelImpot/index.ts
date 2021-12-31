import {get, post} from 'src/api/http';
import * as types from './types';

class ExcelImportMgt {
    getSchemeList (page:number, rows:number, subSysNo:string, schemeName:string): Promise<types.ExcelSchemeList> {
        return get('/sts-excel/getSchemeList', {page, rows, subSysNo, schemeName});
    }

    getExcelDataList (page:number, rows:number, subSysNo:string, fileId:string, checkStatus:string, searchField:string, fieldValue:string): Promise<types.ExcelDataList> {
        return get('/sts-excel/getExcelDataList', {page, rows, subSysNo, fileId, checkStatus, searchField, fieldValue});
    }

    checkName (params:any): Promise<string> {
        return post('/sts-excel/checkSchemeName', params);
    }

    deleteScheme (params:any): Promise<string> {
        return post('/sts-excel/deleteExcelData', params);
    }

}
export default new ExcelImportMgt();
