import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

const { confirm } = Modal;
export default function RightList() {
  const initialState = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];
  const [dataSource, setDataSource] = useState(initialState)
  useEffect(() => {
    // 树形结构数据，父级 rights - 子级 children (对应了树形结构 Table 组件渲染字段 children)
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      let list = res.data
      let item = list.find(item => item.key === "/home")
      console.log("item:", item);
      item && delete item.children  //首页没有子级，删掉 children 控制树形不展示 + 号
      setDataSource(list)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id', //值 对应 Table 中渲染数据 dataSource 的字段
      key: 'id',
      // render 覆盖该列显示的 DOM
      render: (id) => {
        return <span style={{ color: 'green' }}>{id}</span>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color="blue">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={
            <div style={{ textAlign: 'center' }}>
              <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
            </div>
          } title="页面配置项"
            trigger={item.pagepermisson === undefined ? [] : ['click']}
          >
            <Button color={item.pagepermisson === 0 ? "orange" : "blue"} variant="solid" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined}></Button>
          </Popover>
          &nbsp;&nbsp;
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(item)}></Button>
        </div>
      }
    },
  ];

  const showDeleteConfirm = (item) => {
    confirm({
      title: '你确定删除吗?',
      icon: <ExclamationCircleFilled />,
      content: '删除数据后无法恢复！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 此为方案1，还有方案2(删除后重新刷新列表页面)
  const deleteMethod = (item) => {
    console.log("删除 id：", item.id);
    //页面同步删除 state + 后端同步 删除
    if (item.grade === 1) { //删除一级
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else { //删除二级
      console.log(item.rightId);
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      console.log("list:", list);
      setDataSource([...dataSource])  //数据同步给 dataSource
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  // 菜单的开关编辑
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    // console.log(item);
    setDataSource([...dataSource])  //数据同步给 dataSource
    // 同步给后端
    if (item.grade === 1) {
      //后端接口实现：父级关闭，父级关联的子级也都需要关闭
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5  //默认分页数量
      }} />
    </div>
  )
}
