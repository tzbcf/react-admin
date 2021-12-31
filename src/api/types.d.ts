/**
 * FileName : types.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-02 14:38:56
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


export type TaskMess = {
  flag: boolean;
  mess: string | null;
}

export type BasePage = {
  page: number;
  rows: number;
}

export type ReturnData<T> = {
  data: T;
}

export type ReturnPageData<T> = {
  total: number;
  rows: T[];
}

export type PaginationConfig = {
  page: number;
  pageSize: number;
};

export type PageSizeType = {
  page: number;
  rows: number;
}

export type TaskListMess<T = any> = {
  flag: string;
  list: T[];
  mes: string;
  mes2: string|null;
}

export type TaskResult = {
  flag: string;
  result: string;
}
