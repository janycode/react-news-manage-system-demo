import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import zhCN from 'antd/locale/zh_CN'; //国际化，支持中文（如筛选是重置按钮为英文 reset）
import 'dayjs/locale/zh-cn';  // for date-picker i18n
import { ConfigProvider } from 'antd';

import './util/http'

import moment from 'moment';
import 'moment-timezone'; // 引入时区扩展
// 全局设置默认时区为中国上海（UTC+8）
moment.tz.setDefault('Asia/Shanghai');
// 可选：全局设置中文语言（格式化后的星期、月份为中文，如「2026年01月31日 星期六」）
moment.locale('zh-cn');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ConfigProvider locale={zhCN}>  {/* 国际化，支持中文 */}
    <App />
  </ConfigProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
