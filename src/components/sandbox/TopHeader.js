import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SmileOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, Dropdown, Avatar } from 'antd';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
const { Header } = Layout;

function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 解构登陆用户信息
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

    const items = [
        {
            key: '1',
            label: (
                <a rel="noopener noreferrer">
                    {roleName}
                </a>
            ),
            icon: <SmileOutlined />,
            disabled: true,
        },
        {
            key: '3',
            label: (
                <a rel="noopener noreferrer" href="#/right-manage/right/list">
                    权限设置
                </a>
            ),
        },
        {
            key: '4',
            danger: true,
            label: (
                <a onClick={() => {
                    localStorage.removeItem("token")
                    props.history.replace("/login")
                }}>退出</a>
            ),
        },
    ];
    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />

            <div style={{ float: 'right', marginRight: '20px' }}>
                <span>欢迎 <span style={{ color: 'orange' }}>{username}</span> 回来！</span>
                <Dropdown menu={{ items }}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}

export default withRouter(TopHeader)