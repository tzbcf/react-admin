import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import SearchList from 'src/components/common/searchList';
type Props = {
  message: LangMessage,
}

const SearchListPage: React.FC<Props> = () => {
  const columns: any[] = [
    {
      type: 'Input',
      props: {
        placeholder: '测试'
      }
    }
  ];
  return (<div>
    <SearchList columns={columns} />
  </div>)
};

export default connect((state: any) => {
  return {
    message: state.langSwitch.message
  }
})(SearchListPage);