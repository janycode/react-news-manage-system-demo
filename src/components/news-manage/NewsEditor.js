import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html'; // yarn add draftjs-to-html
import { useState } from 'react';
import { Editor } from "react-draft-wysiwyg"; // yarn add react-draft-wysiwyg draft-js
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// 富文本编辑器组件
export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")
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
