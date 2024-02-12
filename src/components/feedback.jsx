import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Spin,
  Table,
  notification,
} from "antd";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import axios from "axios";
import { get } from "lodash";
import { useSelector } from "react-redux";

function Feedback() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [updateId, setUpdateId] = useState("");
  const user = useSelector((state) => state.user.user);
  const [currentPage,setCurrentPage]=useState(1)
  const [loadingButton,setLoadingButton]=useState(false)

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getfeedback`
      );
      setData(get(result, "data.data",[]));
    } catch (e) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFinish = async (values) => {

   try{
    setLoadingButton(true)
    await axios.put(
      `${process.env.REACT_APP_URL}/updatefeedback/${updateId}`,
      values
    );
    notification.success({ message: "feedback Updated successfully" });
    form.resetFields();
    fetchData();
    setOpen(!open);
   }catch(err){
    notification.error({message:"Something went wrong"})
   }finally{
    setLoadingButton(false)
   }
  };

  const handleEdit = (value) => {
    setOpen(!open);
    setUpdateId(value._id);
    form.setFieldsValue(value);
  };

  const columns = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {(currentPage - 1) * 5 + index + 1}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const formattedDate = new Date(createdAt).toLocaleDateString();
        return <h1 className="text-[10px] md:text-[14px]">{formattedDate}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">User Name</h1>,
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Mobile Number</h1>,
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Message</h1>,
      dataIndex: "message",
      key: "message",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px] lg:w-[20vw]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Suggestions</h1>,
      dataIndex: "suggestions",
      key: "suggestions",
      align: "center",
      render: (name) => {
        
        return (
          name === undefined ? (
            <p>No suggestions</p>
          ) : (
            <h1 className="text-[10px] md:text-[14px]">{name}</h1>
          )
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Ratings</h1>,
      dataIndex: "ratings",
      key: "ratings",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Time</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Options</h1>,
      dataIndex: "options",
      key: "options",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Edit</h1>,
      width: 100,
      align: "center",
      render: (values) => {
        return (
          <EditNoteOutlinedIcon
            className=" text-green-500 cursor-pointer !text-[24px]"
            onClick={() => handleEdit(values)}
          />
        );
      },
    },
    
  ];

  const Partnercolumns = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {(currentPage - 1) * 5 + index + 1}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const formattedDate = new Date(createdAt).toLocaleDateString();
        return <h1 className="text-[10px] md:text-[14px]">{formattedDate}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Message</h1>,
      dataIndex: "message",
      key: "message",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    
    {
      title: <h1 className="text-[10px] md:text-[14px]">Ratings</h1>,
      dataIndex: "ratings",
      key: "ratings",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Time</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Options</h1>,
      dataIndex: "options",
      key: "options",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
   
  ];
  return (
    <div className="mt-28 md:pl-[20vw]">
      <Spin spinning={loading}>
        <div className="w-[98vw] md:w-[75vw] lg:w-[78vw]">
        <Table
          columns={ get(user, "name", "")?.split("@")?.includes("menu") ? Partnercolumns : columns}
          dataSource={data}
          pagination={{
            pageSize: 5,
            current: currentPage,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          scroll={{x:1500}}
          className="overflow-x-scroll"
        />
          </div>
      </Spin>

      <Drawer
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
        destroyOnClose
        footer={false}
        width={400}
        title={"Feedback Details"}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
         
          <Form.Item
            name="userName"
            label="User Name"
            rules={[{ required: true }]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              {
                required: true,
                message: "Please enter mobile number",
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject("Mobile number has to be a number.");
                  }
                  if (value.length < 10) {
                    return Promise.reject(
                      "Mobile number can't be less than 5 digits"
                    );
                  }
                  if (value.length > 10) {
                    return Promise.reject("Mobile number more than 5 digits");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="number" size="large" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true }]}
          >
            <Input.TextArea type="text" size="large" />
          </Form.Item>
         
          <Form.Item
            name="ratings"
            label="Ratings"
            rules={[{ required: true }]}
          >
            <Input type="number" size="large" />
          </Form.Item>
          <Form.Item
            name="options"
            label="Options"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="yes">yes</Option>
              <Option value="no">no</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex gap-3 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button htmlType="submit" loading={loadingButton} className="bg-green-500 text-white">
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default Feedback;
