import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, message } from 'antd';
import './Login.min.css'
import { useEffect, useMemo, useState } from "react";
/* -------------------- 粒子特效引入 start -------------------- */
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";  //对应方法的模块，slim 对应 loadSlim
import ParticlesOption from '../../config/ParticlesOption';
/* -------------------- 粒子特效引入 end -------------------- */
import axios from 'axios'
import { withRouter } from 'react-router-dom';

function Login(props) {
  // json-server 模拟登陆效果
  const onFinish = values => {
    console.log('login form: ', values);
    axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_embed=role`)
      .then(res => {
        console.log(res.data);
        if (res.data.length === 0) {
          // 用户名密码不匹配
          message.error("用户名与密码不匹配")
        } else {
          message.success("登陆成功")
          localStorage.setItem("token", JSON.stringify(res.data[0]))
          props.history.push("/")
        }
      })
  };

  /* -------------------- 粒子特效使用 start -------------------- */
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // 你可以在这里启动 tsParticles 实例 (引擎)，添加自定义形状或预设，这样就可以加载 tsParticles 包 bundle，这是从 v2 开始准备一切最简单的方法。
      // 你只需要添加你需要的功能，减小 bundle 大小。即：使用那个方法加载，就 npm i 安装那个模块
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const particlesLoaded = (container) => {
    console.log(container);
  };
  const options = useMemo(() => (ParticlesOption), []);
  /* -------------------- 粒子特效使用 end -------------------- */
  return (
    <div style={{ backgroundColor: 'lightblue', height: '100vh' }}>
      {/* 粒子背景（全屏覆盖，层级最低） */}
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
      <div className='loginForm'>
        <div className='loginTitle'>新闻发布管理系统</div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ width: '400px' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="账号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: 'white' }}>记住用户名和密码</Checkbox>
              </Form.Item>
              <a href="">忘记密码</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              登陆
            </Button>
            <span style={{ color: 'white' }}>或</span> <a href="">立即注册</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default withRouter(Login)