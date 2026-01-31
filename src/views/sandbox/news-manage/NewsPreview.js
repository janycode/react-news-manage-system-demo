import { Descriptions } from 'antd';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment';

// PageHeader 是 antd4 的组件
export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState({})
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_embed=category&_embed=role`).then(res => {
            console.log(res.data);
            setNewsInfo(res.data)
        })
    }, [props.match.params.id])


    const auditList = ["未审核", "审核中", "已通过", "未通过"]
    const publishList = ["未发布", "待发布", "已上线", "已下线"]
    const items = [
        {
            key: '1',
            label: '创建者',
            children: <p>{newsInfo.author ? newsInfo.author : '-'}</p>,
        },
        {
            key: '2',
            label: '创建时间',
            children: <p>{newsInfo.createTime ? moment(newsInfo.createTime).format("YYYY/MM/DD hh:mm:ss") : '-'}</p>,
        },
        {
            key: '3',
            label: '发布时间',
            children: <p>{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD hh:mm:ss") : '-'}</p>,
        },
        {
            key: '4',
            label: '区域',
            children: <p>{newsInfo.region ? newsInfo.region : '-'}</p>,
        },
        {
            key: '5',
            label: '审核状态',
            children: <p style={{color: 'red'}}>{auditList[newsInfo.auditState]}</p>,
        },
        {
            key: '6',
            label: '发布状态',
            children: <p style={{ color: 'red' }}>{publishList[newsInfo.publishState]}</p>,
        },
        {
            key: '7',
            label: '访问数量',
            children: <p>{newsInfo.view}</p>,
        },
        {
            key: '8',
            label: '点赞数量',
            children: <p>{newsInfo.star}</p>,
        },
        {
            key: '9',
            label: '评论数量',
            children: <p>0</p>,
        },
        {
            key: '10',
            label: '内容详情',
            children: (
                <div dangerouslySetInnerHTML={{ __html: newsInfo.content }}>
                </div>
            ),
        },
    ];
  return (
      <div>
          <Descriptions title="内容预览" bordered items={items} />
    </div>
  )
}
