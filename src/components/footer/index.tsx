import React from 'react';
import Icons from 'src/components/common/icon';

const Footer = () => {
  return (<div style={{textAlign: 'center'}}>
    {
      React.createElement(Icons['CopyrightOutlined'])
    }
    <span style={{marginLeft: '5px'}}>2021 WASION INTERNATIONAL</span>
  </div>)
};

export default Footer;