import {
    LeftOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, Steps, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import style from './News.module.scss';

function NewsUpdate(props) {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState("1")
    const [form] = Form.useForm();
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")

    // const User = JSON.parse(localStorage.getItem("token"))

    const items = [
        {
            title: '基本信息',
            content: '新闻标题，新闻分类',
        },
        {
            title: '新闻内容',
            content: '新闻主体内容撰写',
        },
        {
            title: '新闻提交',
            content: '保存草稿或者提交审核',
        },
    ];

    useEffect(() => {
        axios.get("/categories").then(res => {
            console.log(res.data);
            let list = [...res.data]
            list.forEach(item => {
                item.label = item.title
            })
            setCategoryList(list)
            // 核心修复：异步请求完成后，用 form.setFieldsValue 设置默认值
            if (list.length > 0) {
                form.setFieldsValue({
                    categoryId: list[0].label,
                });
            }
        })
    }, [])

    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_embed=category&_embed=role`).then(res => {
            console.log(res.data);
            // 核心修复：异步请求完成后，用 form.setFieldsValue 设置默认值
            const { title, categoryId, content } = res.data
            const categoryTitle = res.data.category.title
            setSelectedCategoryId(categoryId)
            // 设置 form 表单的默认值
            form.setFieldsValue({
                title,
                categoryId: categoryTitle,
            });
            setContent(content)
        })
    }, [])

    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };
    const handleNext = () => {
        // 先校验，再允许下一步
        if (current === 0) {
            // form 表单校验通过才会执行 then
            form.validateFields().then(res => {
                //console.log(res);
                setFormInfo(res) //存 form 表单的数据
                setCurrent(current + 1)
            }).catch(err => {
                console.log("err=", err.message);
            })
        } else {
            //form 和 content
            console.log("form=", form, ", content=", content);
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空！")
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const handlePrev = () => {
        setCurrent(current - 1)
    }

    const handleCategoryChange = (value) => {
        console.log(value);
        let id = categoryList.find(c => c.title === value).id
        // console.log(id);
        setSelectedCategoryId(id)
    }
    const onCreate = (values) => {
        // console.log(values);
    }

    // 更新
    const handleSaveDraft = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "categoryId": selectedCategoryId,
            "content": content,
            "auditState": auditState, //0-草稿, 1-审核
        }).then(res => {
            //根据提交状态，跳转不同的页面
            props.history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
            //提交成功通知提醒窗
            message.success(auditState === 0 ? "保存草稿成功!" : "提交审核中...")
        })
    }
    return (
        <div>
            <h2><a style={{ marginRight: '10px' }} onClick={() => props.history.goBack()}><LeftOutlined /></a>编辑新闻</h2>
            <div style={{marginTop: '50px'}}>
                <Steps current={current} /* status="error" */ items={items} onChange={onChange} />
            </div>

            {/* 使用 display none 控制显隐，不销毁 DOM，用以保留输入值 */}
            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        form={form}
                        /* 24 栅格：4 + 20 */
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        // initialValues={{ categoryId: defaultCategory }}  移除 initialValues！异步场景用 form.setFieldsValue 替代
                        clearOnDestroy
                        onFinish={values => onCreate(values)}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择新闻分类' }]}
                        >
                            <Select
                                options={categoryList} //显示为 label 文本，onChange 传入的是 value
                                onChange={(value) => handleCategoryChange(value)}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(content) => {
                        // console.log(content);
                        setContent(content)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}>
                </div>
            </div>

            <div style={{ marginTop: '50px' }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => { handleSaveDraft(0) }}>保存草稿箱</Button>
                        <Button danger onClick={() => { handleSaveDraft(1) }}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={() => { handleNext() }}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={() => { handlePrev() }}>上一步</Button>
                }
            </div>
        </div>
    )
}

export default withRouter(NewsUpdate)