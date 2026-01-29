import {
    BarsOutlined,
    UserOutlined,
    HomeOutlined,
    ApartmentOutlined
} from '@ant-design/icons';

// 图标映射表
const IconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/add": <BarsOutlined />,
    "/user-manage/delete": <BarsOutlined />,
    "/user-manage/update": <BarsOutlined />,
    "/user-manage/list": <BarsOutlined />,
    "/right-manage": <ApartmentOutlined />,
    "/right-manage/role/update": <BarsOutlined />,
    "/right-manage/role/delete": <BarsOutlined />,
    "/right-manage/role/list": <BarsOutlined />,
    "/right-manage/right/update": <BarsOutlined />,
    "/right-manage/right/delete": <BarsOutlined />,
    "/right-manage/right/list": <BarsOutlined />,
    "/news-manage": <UserOutlined />,
    "/news-manage/list": <BarsOutlined />,
    "/news-manage/add": <BarsOutlined />,
    "/news-manage/update/:id": <BarsOutlined />,
    "/news-manage/preview/:id": <BarsOutlined />,
    "/news-manage/draft": <BarsOutlined />,
    "/news-manage/category": <BarsOutlined />,
    "/audit-manage": <ApartmentOutlined />,
    "/audit-manage/audit": <BarsOutlined />,
    "/audit-manage/list": <BarsOutlined />,
    "/publish-manage": <ApartmentOutlined />,
    "/publish-manage/unpublished": <BarsOutlined />,
    "/publish-manage/published": <BarsOutlined />,
    "/publish-manage/sunset": <BarsOutlined />,
}

export default IconList