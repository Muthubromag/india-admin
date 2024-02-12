import { Modal, notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {isEmpty} from "lodash"

function WhoWeAre({ data }) {
  const [content, setContent] = useState(data[0]?.content || "");

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    if (isEmpty(data[0]?.logo)) {
      Modal.warning({
        title: "If You Want to Change the theme",
        content: "Add Footer settings First",
        okButtonProps: {
          style: {
            backgroundColor: "blue",
            color: "white",
          },
        },
      });
    }else{
      try {
        await axios.post(`${process.env.REACT_APP_URL}/create_footer`, {
          content: content,
        });
        notification.success({ message: "Who we are created successfully" });
      } catch (err) {
        notification.error({message:"Something went wrong"})
      }
    }
   
  };

  return (
    <div>
      <h1>Who We Are</h1>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleEditorChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        }}
        style={{ color: "white" }}
      />
      <button onClick={handleSubmit} className="!bg-green-500 w-[100%] py-1 text-white font-bold">Submit</button>
    </div>
  );
}

export default WhoWeAre;
