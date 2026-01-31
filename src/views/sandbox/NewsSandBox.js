import { Layout, theme } from 'antd'
import NewsRrouter from '../../components/sandbox/NewsRrouter'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewsSandBox.min.css'
// 页面加载进度条引入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'


const { Content } = Layout;

// 登陆后的首页 /
export default function NewsSandBox() {
  // 加载该路由时，展示进度条
  NProgress.start();
  useEffect(() => {
    // 每一次点击页面：侧边栏路由切换时，done
    NProgress.done();
  })

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            //overflow: 'auto', // 让内容在自己的 Content 容器内滚动；默认是视口滚动
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* 放路由组件，切换不同的内容 */}
          <NewsRrouter></NewsRrouter>
        </Content>
      </Layout>
    </Layout>
  )
}
