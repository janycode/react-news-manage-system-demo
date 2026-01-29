import {
    BarsOutlined,
    UserOutlined,
    HomeOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import { Layout, Menu, Avatar } from 'antd';
import { useState } from 'react';
import './index.min.css'
import { withRouter } from 'react-router-dom';

const { Sider } = Layout;

function SideMenu(props) {
    // 配置侧边栏菜单内容，key 值用于高亮和跳转需要唯一
    const items = [
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: '首页',
        },
        {
            key: '/user-manage',
            icon: <UserOutlined />,
            label: '用户管理',
            children: [
                { key: '/user-manage/list', icon: <BarsOutlined />, label: '用户列表' },
            ],
        },
        {
            key: '/right-manage',
            icon: <ApartmentOutlined />,
            label: '权限管理',
            children: [
                { key: '/right-manage/role/list', icon: <BarsOutlined />, label: '角色列表' },
                { key: '/right-manage/right/list', icon: <BarsOutlined />, label: '权限列表' },
            ],
        },
    ]

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
                items={ items }
            />
        </Sider>
    )
}

// 高阶组件方法 withRouter 让组件可以拿到所有 props 的值，用于 history.push 跳转
export default withRouter(SideMenu)