/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, notification } from "antd";
import axios from "axios";
import {get} from "lodash"
import { useEffect, useState } from "react";

function FooterSettings({data,fetchData}) {
  const [fileList,setFileList]=useState([])
  const [form]=Form.useForm()

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  useEffect(()=>{
   if(get(data,"[0].logo")){
    setFileList([
      { uid: "-1", name: "existing_image", status: "done", url: get(data,"[0].logo") },
    ]);
   }
  form.setFieldsValue({
    name: get(data, "[0].name"),
    number: get(data, "[0].contactNumber"),
    email: get(data, "[0].email"),
    address: get(data, "[0].address"),
  });
  },[data,form])


  const handleFinish = async (value) => {
    try {
      const data=new FormData()
      data.append("file",get(value, "img.fileList[0].originFileObj"))
      data.append("address",get(value, "address"))
      data.append("email",get(value, "email"))
      data.append("number",get(value, "number"))
      data.append("name",get(value, "name"))
      
      await axios.post(`${process.env.REACT_APP_URL}/create_footer`, data);
      notification.success({message:"Footer settings created successfully"})
      fetchData()
    } catch (err) {
    
    }
  };

  return (
    <div className="pt-16">
      <Form form={form} layout="vertical" className="w-[80%] h-[80vh] overflow-y-scroll" onFinish={handleFinish} >
        <Form.Item
          name="img"
          label={<h1 className="!text-white pl-2">Enter Restaurant Logo</h1>}
        >
          <Upload
            onPreview={(e) => {
             
            }}
            maxCount={1}
            listType="picture-card"
            multiple={false}
            fileList={fileList}
            onChange={handleChange}
          >
            <div>
              <PlusOutlined className="!text-white" />
              <div style={{ marginTop: 8 }} className="text-white">
                Upload
              </div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="name"
          label={<h1 className="!text-white pl-2">Enter Restaurant Name</h1>}
        >
          <Input type="text"  placeholder="Enter name here" size="large" />
        </Form.Item>
        <Form.Item
          name="number"
          label={<h1 className="!text-white pl-2">Enter Contact Number</h1>}
        >
          <Input type="number" placeholder="Enter number here" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          label={<h1 className="!text-white pl-2">Enter Restaurant Email</h1>}
        >
          <Input
            type="email"
            placeholder="Enter restaurant mail"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="address"
          label={<h1 className="!text-white pl-2">Enter Restaurant Address</h1>}
        >
          <Input.TextArea
            type="text"
            placeholder="Enter restaurant address"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="bg-green-500 text-white w-[150px] float-right"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FooterSettings;
