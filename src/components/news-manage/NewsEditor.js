import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'; // yarn add draftjs-to-html
import htmlToDraft from 'html-to-draftjs'; // yarn add html-to-draftjs
import { useEffect, useState } from 'react';
import { Editor } from "react-draft-wysiwyg"; // yarn add react-draft-wysiwyg draft-js
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// 富文本编辑器组件
export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")

    // NewsUpdate：仅更新时处理接收到组件传过来的值
    useEffect(() => {
        // console.log("NewsEditor props.content=", props.content);
        if (props.content === undefined) return; //创建文章时默认无该字段
        // html -> draft 将富文本内容重新设置回编辑器：回显
        const html = props.content;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content])
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => { setEditorState(editorState) }}  /* state 设置回去，变受控组件 */
                onBlur={() => {
                    //获取富文本编辑器中输入的内容: https://jpuri.github.io/react-draft-wysiwyg/#/demo
                    let content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    // console.log(content);
                    props.getContent(content) //父组件的回调函数，把数据给父组件
                }}
            />
        </div>
    )
}
