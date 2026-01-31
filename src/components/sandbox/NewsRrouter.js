import { Redirect, Route, Switch } from 'react-router-dom'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Home from '../../views/sandbox/home/Home'
import axios from 'axios'
import { useEffect, useState } from 'react'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'

// 路由与组件 本地映射
const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

export default function NewsRrouter() {
    const [backRouteList, setBackRouteList] = useState([])
    // 动态路由通过 api 获取与渲染
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            //console.log(res[0].data, res[1].data); //对应请求顺序
            let list = [...res[0].data, ...res[1].data]
            console.log("routes list=", list);
            setBackRouteList(list)
        })
    }, [])

    const {role: {rights}} = JSON.parse(localStorage.getItem("token"))
    const checkRoute = (item) => {
        //检查本地有，且 pagepermisson 为 1
        return LocalRouterMap[item.key] && item.pagepermisson
    }
    const checkUserPermisson = (item) => {
        // 当前用户权限列表
        return rights.includes(item.key)
    }

    return (
        <div>
            <Switch>
                {/* <Route path="/home" component={Home} />
                <Route path="/user-manage/list" component={UserList} />
                <Route path="/right-manage/role/list" component={RoleList} />
                <Route path="/right-manage/right/list" component={RightList} /> */}
                {
                    backRouteList.map(item => {
                        //校验路由权限 和 校验用户权限
                        if (checkRoute(item) && checkUserPermisson(item)) {
                            return <Route path={item.key} component={LocalRouterMap[item.key]} exact key={item.key} />
                        }
                        return null
                    }
                    )
                }

                <Redirect from="/" to="/home" exact /> {/* exact 精确匹配 */}
                {
                    // ajax 请求回来后，再渲染 404 兜底组件， 否则它会在刷新时会先渲染，导致总是一闪而过
                    backRouteList.length > 0 && <Route path="*" component={NoPermission} /> /* 404 兜底配置 */
                }
            </Switch>
        </div>
    )
}
