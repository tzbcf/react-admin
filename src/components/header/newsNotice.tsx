/*
 * FileName : newsNotice.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2022-01-04 18:17:51
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'src/assets/imgs/common/formlight.png';
import { LangMessage } from 'src/store/common/language';
import { CloseOutlined } from '@ant-design/icons';

const newsNotice = (row: any, status: string, Mes:LangMessage) => {
    console.log('a-----');
    const id = `notice${row.result}`;
    const notcie = document.getElementById(id) as HTMLElement;

    if (!notcie) {
        const dom = document.createElement('div');
        const closeEvent = (selector:string) => {
            const news = document.getElementById(selector) as HTMLElement;

            if (news) {
                document.body.removeChild(news);
            }
        };

        dom.setAttribute('id', id);
        dom.setAttribute('class', 'newModal');
        document.body.appendChild(dom);
        ReactDOM.render((<div className='newNotice'>
            <h6>
                <span className='text'>{Mes['titleNewMessage']}</span>
                <CloseOutlined onClick={() => closeEvent(id)} />
            </h6>
            <div className='intro'>
                <div className='info'>
                    <p>{ Mes[status] }</p>
                    <p>{ row['result']}</p>
                    <p>{ row['etime'] }</p>
                </div>
                <img src={Icon} alt='title' />
            </div>
        </div>), dom);
        setTimeout(() => {
            const news = document.getElementById(id) as HTMLElement;

            if (news) {
                document.body.removeChild(news);
            }
        }, 3000);
    }
};

export default newsNotice;
