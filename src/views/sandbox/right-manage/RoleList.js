import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { Table, Button, Modal, Tree } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
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
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button color="blue" variant="solid" shape="circle" icon={<EditOutlined />} onClick={() => {
            setIsModalOpen(true)
            setCurrentRights(item.rights) //当前选中的权限列表，给弹窗中的 Tree 传参
            setCurrentId(item.id)
          }}></Button>
          &nbsp;&nbsp;
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(item)}></Button>
        </div>
      }
    },
  ]
  useEffect(() => {
    axios.get("http://localhost:5000/roles").then(res => {
      console.log(res.data);
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    // 树形结构数据，父级 rights - 子级 children (对应了树形结构 Table 组件渲染字段 children)
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      let list = res.data
      let item = list.find(item => item.key === "/home")
      console.log("item:", item);
      item && delete item.children  //首页没有子级，删掉 children 控制树形不展示 下拉 号
      //将 label 映射添加 title 字段适配 Tree 组件
      list.forEach(item => {
        item.title = item.label;
        //处理第二层子级
        if (item.children && Array.isArray(item.children) && item.children.length) {
          item.children.forEach(citem => {
            citem.title = citem.label;
          })
        }
      });
      setRightList(list)
    })
  }, [])
  

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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/roles/${item.id}`)
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    console.log(currentRights);
    setIsModalOpen(false)
    //同步 dataSource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {...item, rights: currentRights}  /* 重新赋值 rights */
      }
      return item
    }))
    // patch 同步给后端
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights
    }).then(res => {
      console.log(res);
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
    setCurrentRights(checkedKeys) // 受控组件：根据 currentRights 的改变会重新渲染 Tree 组件
  };

  return (
    <div>
      {/* rowKey 显式指定 Table 遍历行唯一 key 值；除非 dataSource 中返回有唯一 key 则无需显式设置 */}
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>

      <Modal
        title="权限分配"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen} /* 控制对话框弹出或隐藏 */
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          // defaultExpandedKeys={['0-0-0', '0-0-1']}
          // defaultSelectedKeys={['0-0-1']}
          //defaultCheckedKeys={currentRights}  /* 拥有的菜单，即勾选的权限菜单 - defaultxxx非受控 */
          checkedKeys={currentRights}  /* 拥有的菜单，即勾选的权限菜单 - 受控 */
          checkStrictly={true}   /* 取消关联 - 子级关联父级：全不选、部分选、全都选 */
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
