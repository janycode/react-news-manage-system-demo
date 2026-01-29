import {
    BarsOutlined,
    UserOutlined,
    HomeOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import { Layout, Menu, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import './index.min.css'
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import IconList from '../../config/IconList';

const { Sider } = Layout;

function SideMenu(props) {
    const [menu, setMenu] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            console.log(res.data);
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
            return newItem;
        });
    };

    // 拥有页面权限的进行返回展示
    const checkPagePermission = (list) => {
        return list.filter(item => item.pagepermisson === 1)
    }

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
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo">
                <Avatar size="large" icon={<UserOutlined />} />
                <span style={{ margin: '5px' }}>新闻发布系统</span>
            </div>
            <Menu
                onClick={onMenuClick}
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}  /* 菜单高亮 */
                items={menu}
            />
        </Sider>
    )
}

// 高阶组件方法 withRouter 让组件可以拿到所有 props 的值，用于 history.push 跳转
export default withRouter(SideMenu)