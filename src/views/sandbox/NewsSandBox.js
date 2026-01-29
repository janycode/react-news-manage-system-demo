import { Layout, theme } from 'antd'
import { Redirect, Route, Switch } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from './home/Home'
import NoPermission from './nopermission/NoPermission'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import UserList from './user-manage/UserList'
import './NewsSandBox.min.css'

const { Content } = Layout;

// 登陆后的首页 /
export default function NewsSandBox() {
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
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/user-manage/list" component={UserList} />
            <Route path="/right-manage/role/list" component={RoleList} />
            <Route path="/right-manage/right/list" component={RightList} />

            <Redirect from="/" to="/home" exact /> {/* exact 精确匹配 */}
            <Route path="*" component={NoPermission} /> {/* 404 兜底配置 */}
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
