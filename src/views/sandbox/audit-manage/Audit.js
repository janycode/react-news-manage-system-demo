import { Button, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  useEffect(() => {
    axios.get(`/news?auditState=1&_embed=category`).then(res => {
      let list = res.data
      console.log(username, " list=", list);
      // 数据权限：如果是超级管理员，则 list 全部给；如果不是则给出 用户名 和 符合区域+角色 的数据
      let ds = roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ]
      console.log("ds=", ds);
      setDataSource(ds)
    })
  }, [roleId, region, username])

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
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      key: 'auditState',
      render: (auditState) => {
        const colorList = ["gray", "orange", "green", "red"]
        const auditList = ["未审核", "审核中", "已通过", "未通过"]
        return <Tag style={{ color: colorList[auditState] }}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' onClick={() => { handleAudit(item, 2, 1) }}>通过</Button>
          <Button danger onClick={() => { handleAudit(item, 3, 0) }}>驳回</Button>
        </div>
      }
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState,
    }).then(res => {
      if (res.status === 200) {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        message.success(auditState === 2 ? "已通过成功" : "已驳回成功")
      }
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{
        pageSize: 5  //默认分页数量
      }} />
    </div>
  )
}
