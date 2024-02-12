import React, { useEffect, useState } from "react";
import {
  Collapse,
  Table,
  Spin,
  Form,
  Modal,
  Button,
  Input,
  notification,
} from "antd";

import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import {
  DeleteOutlined,
  CaretRightOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { get } from "lodash";
import axios from "axios";
import { useSelector } from "react-redux";

function Admin() {
  const { Panel } = Collapse;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [updateId, setUpdateId] = useState("");
  const user = useSelector((state) => state.user.user);
  const [loadingButton, setLoadingButton] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getallusers`
      );
      setData(get(result, "data.data", []));
    } catch (e) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchData()
  },[])

  const handleEdit = (values) => {
    setUpdateId(values._id);
    setOpen(!open);
    form.setFieldsValue(values);
  };

  const handleDelete = async (val) => {
    try {

      let data = {
        image: get(val, "name"),
      };

      await axios.delete(
        `${process.env.REACT_APP_URL}/deleteuser/${val._id}`, { data }
      );

      notification.success({ message: "admin deleted successfully" });
      fetchData();
    } catch (err) {
      notification.error({message:"Something went wrong"})
    }
  };

  const handleFinish = async (value) => {
  try{
    setLoadingButton(true)
    const url = updateId
    ? `${process.env.REACT_APP_URL}/updateuser/${updateId}`
    : `${process.env.REACT_APP_URL}/createadminuser`;

    const method = updateId ? axios.put : axios.post;
    await method(url, value );
    fetchData();
    form.resetFields();
    setOpen(!open);
    setUpdateId("")
    const successMessage = updateId
    ? "Admin user updated successfully"
    : "Admin user created successfully";
    notification.success({ message: successMessage });
  }catch(err){
   notification.error({message:"Something went wrong"})
  }finally{
    setLoadingButton(false)
  }
    
    
  }


  

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
      title: <h1 className="text-[10px] md:text-[14px] ">Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px] ">Password</h1>,
      dataIndex: "password",
      key: "password",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className={`text-[10px] md:text-[14px] `}>Edit</h1>,
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
    {
      title: <h1 className="text-[10px] md:text-[14px]">Delete</h1>,
      width: 100,
      align: "center",
      render: (values) => {
        return (
          <DeleteOutlined
            className=" text-red-500 cursor-pointer !text-[18px]"
            onClick={() => handleDelete(values)}
          />
        );
      },
    },
  ];

  return (
    <div className="mt-28 md:pl-[20vw]">
      <div className="!w-[99vw] md:!w-[80vw] lg:!w-[80vw]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
        >
          <Panel
            header={
              <h1 className="text-md text-[#CD5C08] font-semibold">Admin</h1>
            }
            extra={
              <div
                className="cursor-pointer"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <FileAddOutlined className="!text-[#CD5C08] !text-xl" />
              </div>
            }
            key="1"
          >
            <div className="flex flex-col ">
              <div className="flex flex-col gap-y-2">
                <div className="p-2 ">
                  <Spin spinning={loading}>
                    <Table
                      columns={columns}
                      key="id"
                      size="middle"
                      pagination={{
                        pageSize: 5,
                        current: currentPage,
                        onChange: (page) => {
                          setCurrentPage(page);
                        },
                      }}
                      dataSource={data}
                      scroll={{ x: 800 }}
                      className="overflow-x-scroll"
                    />
                  </Spin>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
      <Modal
        open={open}
        footer={false}
        destroyOnClose
        onCancel={() => {
          setOpen(!open);
          form.resetFields();
          setUpdateId("")
          setLoadingButton(false)
        }}
      >
        <Form
          layout="vertical"
          className="pt-3"
          onFinish={handleFinish}
          form={form}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter Your name",
              },
            ]}
           
          >
            <Input
              type="text"
              size="large"
              disabled={updateId!=="" ? true : false}
              placeholder="Enter your Name"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter Your new password",
              },
            ]}
          >
            <Input
              type="text"
              defaultValue={get(user, "password", "")} 
              size="large"
              placeholder="New password" 
            />
            
          </Form.Item>
          <Form.Item>
            <div className="flex gap-3 !pt-2 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                  setUpdateId("");
                  setLoadingButton(false)
                }}
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                loading={loadingButton}
                className="bg-green-500 text-white"
              >
                {updateId ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>


  )
}

export default Admin;