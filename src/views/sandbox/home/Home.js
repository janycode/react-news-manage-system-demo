import React from 'react'
import { Button } from 'antd';
import axios from 'axios'

export default function Home() {
  const ajax = () => {
    //模拟后端数据启动命令：json-server --watch .\db\test.json --port 8000
    //取数据
    // axios.get("http://localhost:8000/posts").then(res => {
    //   console.log(res.data);
    // })
    //增数据
    // axios.post("http://localhost:8000/posts", {
    //   title: "ddd",
    //   author: "xiaoming"
    // })
    //改数据-替换所有字段
    // axios.put("http://localhost:8000/posts/1", {
    //   title: "11111-修改-1111b"
    // })
    //改数据-部分字段
    // axios.patch("http://localhost:8000/posts/1", {
    //   title: "222-修改-222"
    // })
    //删数据
    // axios.delete("http://localhost:8000/posts/72d1")
    //_embed 关联查询（关联子表数据，向下关联）
    // axios.get("http://localhost:8000/posts?_embed=comments").then(res => {
    //   console.log(res.data);
    // })
    //_expand 关联查询（关联父表数据，向上关联） postId, 所以取值为 post
    // axios.get("http://localhost:8000/comments?_expand=post").then(res => {
    //   console.log(res.data);
    // })
  }
  return (
    <div>
      <div>Home</div>
      <Button type="primary" onClick={ajax}>按钮</Button>
    </div>
  )
}
