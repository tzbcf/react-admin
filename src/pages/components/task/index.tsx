/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-24 18:57:32
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef} from 'react';
import TaskCom, {TaskRef} from 'src/components/business/taskCom';
// import { RangePickerProps } from 'antd/lib/date-picker/index.d';
const TaskPage = () => {
    // const TimePicker: RangePickerProps = {
    //     showTime: true,
    //     picker: 'date',
    // };
    const taskRef = useRef<TaskRef<any>>();
    const onChick = (row: any) => {
        console.log('selectedRowKeys-----', row);
    };

    const getLeftTreeData = (val: any) => {
        console.log(val);
    };

    const groupTaskFormatTitle = (v:any) => `${v}`;

    return (
        <div>
            <TaskCom
                onChick={onChick}
                title='a'
                taskRef={taskRef}
                groupTaskFormatTitle={groupTaskFormatTitle}
                getList={getLeftTreeData} />
        </div>
    );
};

export default TaskPage;


