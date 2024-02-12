/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Switch,
  Upload,
  Button,
  Spin,
  Table,
  Drawer,
  Collapse,
  notification,
  Image,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { CaretRightOutlined, FileAddOutlined } from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

const SocialMediaSettings = ({ SocialfetchData }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const { Panel } = Collapse;
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [data, setData] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [imageKey, setImageKey] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/get_socialmedia`
      );
      setData(get(result, "data.data", []));
    } catch (err) {
    
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (value) => {
    try {
      setLoadingButton(true);
      const data = new FormData();
      if (updateId!=="") {
        data.append(
          "file",
          get(value, "img.fileList[0].originFileObj")
        );

        data.append("image", imageUrl);
      } else {
        data.append(
          "file",
          get(value, "img.fileList[0].originFileObj")
        );
      }
      data.append("name", get(value,"name",""));
      data.append("link", get(value,"link",""));
      data.append("status", value.status || false);
      const url = updateId
      ? `${process.env.REACT_APP_URL}/update_socialmedia/${updateId}`
      : `${process.env.REACT_APP_URL}/create_socialmedia`;

    const method = updateId ? axios.put : axios.post;

    await method(url, data);

    const successMessage = updateId
      ? "Social media updated successfully"
      : "Social media created successfully";

    notification.success({ message: successMessage });
    setUpdateId("");
    form.resetFields();
    fetchData();
    setImageUrl("");
    setFileList([])
    setOpen(!open);
    SocialfetchData()
    setIsAvailable(false)
    } catch (err) {
      
    }finally{
      setLoadingButton(false)
    }
  };

  useEffect(() => {
    setLoading(true);
    setInterval(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (val) => {
    setOpen(!open);
    form.setFieldsValue(val);
    setImageUrl(val.image);
    setUpdateId(val._id);
    setIsAvailable(val.status);
    setImageKey(val.footer_image_key);
    setFileList([
      { uid: "-1", name: "existing_image", status: "done", url: val.image },
    ]);
  };

  const handleStatus = async (status, value) => {
    try {
      const formData = {
        name: value.name,
        image: value.image,
        link: value.link,
        status: status,
      };

      await axios.put(
        `${process.env.REACT_APP_URL}/update_socialmedia/${value._id}`,
        formData
      );
      fetchData();
      notification.success({ message: "Status updated successfully" });
    } catch (err) {
     
    }
  };

  const handleDelete = async (val) => {
    try {
      const data = {
        image: get(val, "image"),
      };

      await axios.delete(
        `${process.env.REACT_APP_URL}/delete_socialmedia/${val._id}`,
        { data }
      );

      notification.success({ message: "Product deleted successfully" });
      fetchData();
    } catch (error) {
     
      notification.error({ message: "Failed to delete Footer" });
    }
  };



  const columns = [
    {
      title: <h1>Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
        return (
          <Image
            alt="logo"
            width={60}
            className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
            src={name}
            preview={false}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Link</h1>,
      dataIndex: "link",
      key: "link",
      align: "center",
      render: (name) => {
        return <p>{name}</p>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, value) => {
        return (
          <Switch
            className="text-md"
            checked={status}
            onChange={(checked) => handleStatus(checked, value)}
          />
        );
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
    <div className="mt-20">
      <div className="lg:w-[40vw]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
          className="lg:!w-[40vw]"
        >
          <Panel
            header={
              <h1 className="text-md !text-[#CD5C08] font-semibold">
                Footer settings
              </h1>
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
            <Spin spinning={loading}>
              <Table columns={columns} dataSource={data} scroll={{ x: 600 }} />
            </Spin>
          </Panel>
        </Collapse>
        <Drawer
          open={open}
          destroyOnClose
          title={"Add Footer Details"}
          onClose={() => {
            setOpen(!open);
            form.resetFields();
            setIsAvailable(false);
            setUpdateId("");
            setImageUrl(null);
            setFileList([]);
          }}
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="flex flex-col gap-2"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name!" }]}
            >
              <Input placeholder="Enter name..." size="large" />
            </Form.Item>

            <Form.Item
              name="link"
              label="Link"
              rules={[{ required: true, message: "Please enter a link!" }]}
            >
              <Input placeholder="Enter link..." size="large" />
            </Form.Item>

            <Form.Item
              name="img"
              rules={[
                {
                  required: updateId === "" ? true : false,
                  message: "Select footer image",
                },
              ]}
            >
              <Upload
                onChange={handleChange}
                fileList={fileList}
                onPreview={(e) => {
               
                }}
                maxCount={1}
                listType="picture-card"
                multiple={false}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item name="status" label="Switch Field">
              <Switch
                checked={isAvailable}
                onChange={(checked) => setIsAvailable(checked)}
              />
            </Form.Item>

            <Form.Item className="flex items-end justify-end pt-5">
              <div className="flex gap-6 items-center justify-end">
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => {
                    setOpen(!open);
                    setIsAvailable(false);
                    setUpdateId("");
                    form.resetFields();
                    setImageUrl(null);
                    setFileList([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  loading={loadingButton}
                  className="bg-green-500 text-white"
                >
                  {updateId !== "" ? "Update" : "Save"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </div>
  );
};

export default SocialMediaSettings;
