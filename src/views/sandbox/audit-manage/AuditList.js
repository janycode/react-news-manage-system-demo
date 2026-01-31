import { Button, Table, Tag, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    // json-server 的条件支持 _ne 不等于，_lte 小于等于
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_embed=category`).then(res => {
      console.log(res.data);
      setDataSource(res.data)
    })
  }, [username])

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
          {
            item.auditState === 1 && <Button onClick={() => {handleRevert(item)}}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => {handlePublish(item)}}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => {handleUpdate(item)}}>更新</Button>
          }
        </div>
      }
    },
  ];

  const handleRevert = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      if (res.status === 200) {
        message.success("撤销成功！草稿箱中查看...")
      }
    })
  }

  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      publishState: 2, //2-已发布
    }).then(res => {
      if (res.status === 200) {
        message.success("发布成功！")
        //props.history.push("/publish-manage/published")  //可跳转，可不跳转
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
