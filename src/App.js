import React, { useEffect } from 'react'
import Child from './Child'
import './App.css'
import axios from 'axios'

export default function App() {

  useEffect(() => {
    axios("/ajax/comingList?ci=73&token=&limit=10&optimus_risk_level=71&optimus_code=10")
      .then(res => {
        console.log(res.data.coming);
      })
  }, [])


  return (
    <div>
      App
      <ul>
        <li>111</li>
        <li>222</li>
      </ul>
      <Child />
    </div>
  )
}
