/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-27 16:45:07
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { ReturnData } from '../types';

type FrozenRate = {
  FROZEN_TIME: string;
  TOTAL_READ: number;
  AUTUAL_READ: number;
}

export interface FrozenSuccessRate extends ReturnData<FrozenRate[]> {}
