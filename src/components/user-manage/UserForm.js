import { Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';

export default function UserForm(props) {
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        setIsDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled]) //重要：绑定父组件传过来的的禁用属性，如果变化就就同步设置自身的禁用属性！

    const handleRegionChange = (val) => {
        console.log("handleRegionChange:", val);
    }
    const handleRoleChange = (val) => {
        console.log("handleRoleChange:", val);
        if (val === "1") {
            setIsDisabled(true)  /* 如果选择超级管理员，则区域非必填 */
            props.form.setFieldsValue({ region: '' });  /* 同时清空区域字段值 */
        } else {
            setIsDisabled(false)
            //props.form.setFieldsValue({ region: { value: 1, label: '亚洲' } });
        }
    }
    return (
        <div>
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={[{ required: !isDisabled, message: '请选择区域' }]}  /* 控制非必填 */
            >
                <Select
                    // defaultValue={props.selectedRegion}
                    style={{ width: '100%' }}
                    onChange={(val) => handleRegionChange(val)}
                    options={props.regionList}
                    disabled={isDisabled}        /* 控制禁用 */
                />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
            >
                <Select
                    // defaultValue={props.selectedRole}
                    style={{ width: '100%' }}
                    onChange={(val) => handleRoleChange(val)}
                    options={props.roleList}
                />
            </Form.Item>
        </div>
    )
}
