import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SmileOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, Dropdown, Avatar } from 'antd';
import { useState } from 'react';
const { Header } = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const items = [
        {
            key: '1',
            label: (
                <a rel="noopener noreferrer">
                    超级管理员
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
            label: '退出',
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
                <span>欢迎 admin 回来！</span>
                <Dropdown menu={{ items }}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
