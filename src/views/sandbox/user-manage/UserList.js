import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { Button, Form, Modal, Switch, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [defaultRegion, setDefaultRegion] = useState(0)
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [currentUpdate, setCurrentUpdate] = useState(null)

  // 取出登陆用户信息
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  console.log("roleId=", roleId, ", role=", roleObj[roleId]);
  
  // 请求用户列表（含关联角色信息）
  useEffect(() => {
    axios.get("http://localhost:5000/users?_embed=role").then(res => {
      let list = res.data
      console.log("users list=", list);
      // 如果是超级管理员，则 list 全部给；如果不是则给出 用户名 和 符合区域+角色 的数据
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [])
  // 请求角色列表
  useEffect(() => {
    axios.get("http://localhost:5000/roles").then(res => {
      let list = res.data
      list.forEach(item => {  //字段映射
        item.label = item.roleName
        item.value = item.id  //取值使用 id
        item.disabled = roleObj[roleId] !== "superadmin"  //true 时，不允许编辑: 只有超级管理员可以编辑
      });
      setRoleList(list)
    })
  }, [])
  // 请求区域列表
  useEffect(() => {
    axios.get("http://localhost:5000/regions").then(res => {
      let list = res.data
      list.forEach(item => {  //字段映射
        item.label = item.title
        item.value = item.title //取值也使用 title
      })
      let defaultRegion = { label: "全球", value: "" }
      list = [defaultRegion, ...list]
      setRegionList(list)
      // 核心修复：异步请求完成后，用 form.setFieldsValue 设置默认值
      if (list.length > 0) {
        form.setFieldsValue({
          region: list[0].label,
        });
      }
    })
  }, [])

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
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      filters: [{
        text: "全球",
        value: ""
      }, ...regionList.map(r => {
        return {
          text: r.title,
          value: r.title, //value被转为数字使用匹配了，此处都用文本进行匹配过滤
        }
      })],
      onFilter: (value, item) => item.region === value,
      render: (region) => {
        return <b>{region ? region : "全球"}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'roleId',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, item) => {
        return <div><Switch checked={roleState} disabled={item.default} onChange={() => onHandleSwitch(item)}></Switch></div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button color="blue" variant="solid" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => showHandleUpdate(item)}></Button>
          &nbsp;&nbsp;
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => showDeleteConfirm(item)}></Button>
        </div>
      }
    },
  ];

  /* ---------------------------------------- delete start ---------------------------------------- */
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
    axios.delete(`http://localhost:5000/users/${item.id}`).then(res => {
      // console.log("delete=", res);
      if (res.status === 200) {
        setDataSource(dataSource.filter(data => data.id !== item.id)) //过滤掉已删除的数据，删除成功更新 DOM
      } else {
        console.error("接口请求删除失败！", res);
      }
    })
  }
  /* ---------------------------------------- delete end ---------------------------------------- */

  const onHandleSwitch = (item) => {
    // console.log(item);
    item.roleState = !item.roleState
    // 同步后端
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    }).then(res => {
      //console.log(res);
      if (res.status === 200) {
        console.log("用户状态修改成功 Toast");
        setDataSource([...dataSource]) //编辑成功，更新 DOM
      } else {
        console.error("接口请求设置失败！", res);
      }
    })
  }

  /* ---------------------------------------- add start ---------------------------------------- */
  const addUser = () => {
    setOpen(true) //打开对话框-新增
  }

  const onCreate = values => {
    console.log('拿到 form 表单 json: ', values);
    setOpen(false); //隐藏对话框

    // post 提交后端新增用户，生成新的主键 id -> 用于后续的编辑和删除
    axios.post(`http://localhost:5000/users`, {
      ...values,
      "region": values.region.label === "全球" ? "" : values.region.label,
      "roleState": true,
      "default": false,
    }).then(res => {
      console.log("新增结果: ", res); // res.status === 201 新增数据成功
      if (res.status === 201) {
        setDataSource([...dataSource, {
          ...res.data,  //返回数据里携带了 id
          role: roleList.filter(item => item.id === values.roleId)[0]
        }])
      } else {
        console.error("接口请求新增失败！", res);
      }
    })
    // form.resetFields() //清空字段值，组件自带，无需手动重置掉
  };
  /* ---------------------------------------- add end ---------------------------------------- */

  /* ---------------------------------------- update start ---------------------------------------- */
  const showHandleUpdate = (item) => {
    console.log("showHandleUpdate=", item); // use 中的 role 是个对象类型
    setUpdate(true) //打开对话框-编辑
    setIsUpdateDisabled(item.roleId === "1" ? true : false)  //管理员禁用修改字段
    // 放在异步中，可以让数据变成同步触发
    setTimeout(() => {
      updateForm.setFieldsValue({
        ...item,
        // 兼容 Select 的 value 格式（因为 item 中是 roleId）
        roleId: item.role?.id || item.roleId,
      })  //动态设定 form 表单中的值
    }, 0)
    setCurrentUpdate(item)  //临时保存更新的字段值
  }

  const onUpdate = values => {
    console.log("更新 form 表单 json: ", values);
    setUpdate(false)
    // 同步后端
    axios.patch(`http://localhost:5000/users/${currentUpdate.id}`, values).then(res => {
      console.log(res);
      if (res.status === 200) {
        // 请求成功，更新 DOM 列表 dataSource
        setDataSource(dataSource.map(item => {
          if (item.id === currentUpdate.id) {
            return {
              ...item,
              ...values,
              role: roleList.filter(r => r.id === values.roleId)[0]
            }
          }
          return item
        }))
      } else {
        console.error("接口请求更新失败！", res);
      }
    })
  }
  /* ---------------------------------------- update end ---------------------------------------- */

  return (
    <div>
      <Button type='primary' onClick={() => addUser()}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{
        pageSize: 5  //默认分页数量
      }} />

      {/* 新增对话框 */}
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        modalRender={dom => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            //initialValues={{ region: defaultRegion }}  移除 initialValues！异步场景用 form.setFieldsValue 替代
            clearOnDestroy
            onFinish={values => onCreate(values)}  /* values 即 form 表单所有字段值，用于提交后端 */
          >
            {dom}
          </Form>
        )}
      >
        {/* form 对象的引用传给 子组件，便于控制整个 form 表单，如置空字段 */}
        <UserForm form={form} regionList={regionList} roleList={roleList} />
      </Modal>

      {/* 更新对话框 */}
      <Modal
        open={update}
        title="编辑用户"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => {
          setUpdate(false)
          // setIsUpdateDisabled(!isUpdateDisabled)  //目前新版的 antd v6 版本不会有禁用状态存留问题，如果禁用状态存留了，就打开该注释
        }}
        destroyOnHidden
        modalRender={dom => (
          <Form
            layout="vertical"
            form={updateForm}
            name="form_in_modal"
            clearOnDestroy
            onFinish={values => onUpdate(values)}  /* values 即 form 表单所有字段值，用于提交后端 */
          >
            {dom}
          </Form>
        )}
      >
        {/* form 对象的引用传给 子组件，便于控制整个 form 表单，如置空字段 */}
        <UserForm form={updateForm} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled} />
      </Modal>
    </div>
  )
}
