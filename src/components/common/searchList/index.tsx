import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Input } from 'antd';

type Props = {
  message: LangMessage,
  columns : any[]
}
const SearchList: React.FC<Props> = (props) => {
  const { message: mes, columns = [] } = props;
  return (<div>
    <h4>{mes['compontentTitleSearchList']}</h4>
    <ul>
      {
        columns.map((v: any, i: number) => {
          let element: React.ReactNode;
          switch (v.type) {
            case 'input':
              element = <Input {...v.props} />
              break;
          }
          return (<li key={i}>{ element }</li>)
        })
      }
    </ul>
  </div>)
};

export default connect((state: any) => {
  return {
    message: state.langSwitch.message
  }
})(SearchList);

