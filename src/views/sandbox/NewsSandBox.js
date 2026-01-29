import { Route, Switch, Redirect } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import Home from './home/Home'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import UserList from './user-manage/UserList'
import NoPermission from './nopermission/NoPermission'

// 登陆后的首页 /
export default function NewsSandBox() {
  return (
    <div>
      <SideMenu></SideMenu>
      <TopHeader></TopHeader>
      {/* 放路由组件，切换不同的内容 */}
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/user-manage/list" component={UserList} />
        <Route path="/right-manage/role/list" component={RoleList} />
        <Route path="/right-manage/right/list" component={RightList} />

        <Redirect from="/" to="/home" exact /> {/* exact 精确匹配 */}
        <Route path="*" component={NoPermission} /> {/* 404 兜底配置 */}
      </Switch>
    </div>
  )
}
