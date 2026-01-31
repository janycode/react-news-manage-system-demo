import {
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import IconList from '../../config/IconList';
import './index.min.css';

const { Sider } = Layout;

function SideMenu(props) {
    const [menu, setMenu] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            // console.log(res.data);
            setMenu(addMenuIcon(checkPagePermission(res.data)))
        })
    }, [])

    /**
     * 递归给嵌套菜单添加图标（根据path匹配IconList）
     * @param {Array} menuArr - 待处理的菜单数组
     * @returns {Array} 新的菜单数组（含icon字段）
     */
    const addMenuIcon = (list) => {
        return list.map(item => {
            // 核心：解构剔除 rightId，保留其他所有字段(因为渲染dom树时不能有驼峰)
            const { rightId, ...restItem } = item;
            // 匹配图标（原有逻辑不变）
            const matchIcon = IconList[restItem.key];
            // 组装新对象：无rightId + 新增icon
            const newItem = { ...restItem, icon: matchIcon };
            // 递归处理子菜单（自动剔除子菜单的rightId）
            if (newItem.children && Array.isArray(newItem.children) && newItem.children.length) {
                newItem.children = addMenuIcon(newItem.children);
            }
            if (!newItem.children || !Array.isArray(newItem.children) || newItem.children.length === 0) {
                delete newItem.children; // 非有效子菜单，直接删除children字段
            }
            return newItem;
        });
    };

    // 拥有页面权限的进行返回展示
    let { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    // console.log("rights=", rights);
    const checkPagePermission = (list) => {
        console.log("user rights:", rights);
        // 定义递归函数：处理单个菜单（父级/子级通用）
        const filterMenu = (menuItem) => {
            // 1. 先过滤当前菜单的子级children（递归调用，子级的子级也会被过滤）
            if (menuItem.children && menuItem.children.length > 0) {
                // 子级过滤规则：pagepermisson===1 + 权限rights包含其key
                menuItem.children = menuItem.children
                    .filter(citem => citem.pagepermisson === 1 && rights.includes(citem.key))
                    .map(child => filterMenu(child)); // 递归处理子级的children
            }
            // 2. 返回当前菜单（父级过滤规则：pagepermisson===1）
            return menuItem;
        };

        // 主逻辑：过滤父级 + 递归处理所有子级
        let res = list
            .filter(item => item.pagepermisson === 1) // 父级先过滤pagepermisson===1
            .map(item => filterMenu(item)) // 对每个父级，递归处理其子级
            // 边界处理：过滤后子级为空的父级（可选，根据业务是否保留空children父级）
            .filter(item => !item.children || item.children.length > 0);

        console.log("用户菜单权限列表:", res);
        return res;
    };

    // 配置侧边栏菜单内容，key 值用于高亮和跳转需要唯一
    // const items = [
    //     {
    //         key: '/home',
    //         icon: <HomeOutlined />,
    //         label: '首页',
    //     },
    //     {
    //         key: '/user-manage',
    //         icon: <UserOutlined />,
    //         label: '用户管理',
    //         children: [
    //             { key: '/user-manage/list', icon: <BarsOutlined />, label: '用户列表' },
    //         ],
    //     },
    //     {
    //         key: '/right-manage',
    //         icon: <ApartmentOutlined />,
    //         label: '权限管理',
    //         children: [
    //             { key: '/right-manage/role/list', icon: <BarsOutlined />, label: '角色列表' },
    //             { key: '/right-manage/right/list', icon: <BarsOutlined />, label: '权限列表' },
    //         ],
    //     },
    // ]

    const [collapsed, setCollapsed] = useState(false);

    const onMenuClick = e => {
        // console.log('click ', e);  // key 是路径
        // console.log('props ', props); // props.history.push
        props.history.push(e.key)
    };

    //console.log(props.location); // props.location.pathname
    const selectMenuKeys = [props.location.pathname]
    const openMenuKeys = ["/" + props.location.pathname.split("/")[1]]
    //console.log(openMenuKeys); // eg: ['/user-manage']
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <div className="logo">
                    <Avatar size="large" icon={<UserOutlined />} />
                    <span style={{ margin: '5px' }}>新闻发布系统</span>
                </div>
                <Menu style={{ flex: '1', overflow: 'auto' }}
                    onClick={onMenuClick}
                    theme="dark"
                    mode="inline"
                    /* 不成文规律：defaultxxx=yyy 非受控组件；  xxx=yyy 受控组件，可以解决 重定向到首页时首页菜单高亮问题 */
                    //defaultSelectedKeys={selectMenuKeys}  /* 菜单高亮，页面刷新保持当前菜单高亮 */
                    selectedKeys={selectMenuKeys}  /* 菜单高亮，页面刷新保持当前菜单高亮 */
                    defaultOpenKeys={openMenuKeys}  /* 默认打开菜单 */
                    items={menu}
                />
            </div>
        </Sider>
    )
}

// 高阶组件方法 withRouter 让组件可以拿到所有 props 的值，用于 history.push 跳转
export default withRouter(SideMenu)