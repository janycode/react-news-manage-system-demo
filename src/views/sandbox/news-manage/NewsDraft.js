import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  RocketOutlined
} from '@ant-design/icons';
import { Button, Modal, Table, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

const { confirm } = Modal;
function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_embed=category`).then(res => {
      let list = res.data
      setDataSource(list)
    })
  }, [username])

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      "auditState": 1, //0-草稿, 1-审核
    }).then(res => {
      //根据提交状态，跳转不同的页面
      props.history.push("/audit-manage/list")
      //提交成功通知提醒窗
      message.success("提交审核中...")
    })
  }
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
      title: '状态',
      dataIndex: 'auditState',
      key: 'auditState',
      render: () => {
        return <span style={{ color: 'red' }}>草稿</span>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button color="blue" variant="solid" shape="circle" icon={<EditOutlined />} onClick={() => {
            props.history.push(`/news-manage/update/${item.id}`)
          }}></Button>
          &nbsp;
          <Button color="green" variant="solid" shape="circle" icon={<RocketOutlined />} onClick={() => {handleCheck(item.id)}}></Button>
          &nbsp;
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
    axios.delete(`/news/${item.id}`).then(res => {
      if (res.status === 200) {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        message.success("删除成功！")
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

export default withRouter(NewsDraft)