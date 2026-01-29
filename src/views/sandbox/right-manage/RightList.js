import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

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
    axios.get("http://localhost:5000/rights").then(res => {
      setDataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id', //值 对应 Table 中渲染数据 dataSource 的字段
      key: 'id',
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
    },
  ];
  return (
    <div><Table dataSource={dataSource} columns={columns} /></div>
  )
}
