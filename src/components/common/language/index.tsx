import React, {useState} from 'react';
import { Select } from 'antd';
const { Option } = Select;

const Lang = () => {
  const [lang, setLang] = useState(localStorage.getItem('language') || 'Languages');

  const handleChange = (res: string) => {
    setLang(res);
    localStorage.setItem('language', res);
  };

  return (
    <Select placeholder='Languages' value={lang} bordered={false} onChange={handleChange} className='flexCenter'>
      <Option value='en_US'>English</Option>
      <Option value='es_ES'>España</Option>
      <Option value='zh_CN'>简体中文</Option>
    </Select>
  );
};

export default Lang;
