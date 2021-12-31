export interface GetLangRes {
  [key: string]: string
}

type AddField = {
  content: string;
  field: string;
}

export interface AddLangParams {
  code: string;
  fields: AddField[];
}

export interface GetLangList extends AddLangParams {
  page: number;
  rows: number;
}

type LangListRow = {
  [key: string]: string;
}

export interface ReturnLangList {
  total: number;
  rows: LangListRow[];
}
