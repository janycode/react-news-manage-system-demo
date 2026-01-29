import React, { useEffect } from 'react'
import Child from './Child'
import './App.css'
import axios from 'axios'
import IndexRouter from './router/IndexRouter'

export default function App() {

  // 测试验证 反向代理 - 可删除
  // useEffect(() => {
  //   axios("/ajax/comingList?ci=73&token=&limit=10&optimus_risk_level=71&optimus_code=10")
  //     .then(res => {
  //       console.log(res.data.coming);
  //     })
  // }, [])

  return (
    <div>
      {/* 引入路由 */}
      <IndexRouter></IndexRouter>
    </div>
  )
}
