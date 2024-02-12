/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Table,
  Collapse,
  Switch,
  Form,
  Input,
  Modal,
  Upload,
  notification,
  Button,
  Image,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  CaretRightOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useSelector } from "react-redux";

function Category() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [data, setData] = useState([]);
  const { Panel } = Collapse;
  const [form] = Form.useForm();
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [imageKey, setImageKey] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const user = useSelector((state) => state.user.user);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getcategory`
      );
      setData(get(result, "data.data", []));
    } catch (e) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleFinish = async (value) => {
    try {
      setLoadingButton(true)
      const data = new FormData();
      if (updateId !== "") {
        data.append(
          "file",
          get(value, "img.fileList[0].originFileObj") || null
        );
        data.append("image", imageUrl);
      } else {
        data.append("file", get(value, "img.fileList[0].originFileObj"));
      }
      data.append("name", value.name);
      data.append("status", value.status === undefined ? false : value.status);

      const url = updateId
        ? `${process.env.REACT_APP_URL}/updatecategory/${updateId}`
        : `${process.env.REACT_APP_URL}/createcategory`;

      const method = updateId ? axios.put : axios.post;

      await method(url, data);

      const successMessage = updateId
        ? "Category updated successfully"
        : "Category created successfully";

      notification.success({ message: successMessage });
      setUpdateId("");
      form.resetFields();
      fetchData();
      setImageUrl("");
      setOpen(!open);
      setFileList([]);
      setIsAvailable(false);
    } catch (err) {
      notification.error({message:"Something went wrong"})
      if (get(err, "response.data")?.split(" ")?.includes("limit")) {
        Modal.warning({
          title: get(err, "response.data"),
          content:
            "if you really wanna add Cuisines you have to delete existing one",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      } else if (get(err, "response.data")?.split(" ").includes("exists")) {
        Modal.warning({
          title: get(err, "response.data"),
          content: "Add a new Cuisine name",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      }
    }finally{
      setLoadingButton(false)
    }
  }

  const handleEdit = (val) => {
    setOpen(!open);
    setImageUrl(val.image);
    setFileList([
      { uid: "-1", name: "existing_image", status: "done", url: val.image },
    ]);
    form.setFieldsValue(val);
    setUpdateId(val._id);
    setIsAvailable(val.status);
    setImageKey(val.category_image_key);
  };

  const handleDelete = async (val) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/getsubcategory`
      );

      const isCategoryMapped = response.data.data.some(
        (subcategory) => subcategory.categoryId === val._id
      );

      if (isCategoryMapped) {
        Modal.warning({
          title: "This Category Mapped With SubCategory",
          content: "if you really wanna delete this delete subcategory first",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
        return;
      } else {
        let data = {
          image: get(val, "image"),
        };

        await axios.delete(
          `${process.env.REACT_APP_URL}/deletecategory/${val._id}`,
          { data }
        );

        notification.success({ message: "Category deleted successfully" });
        fetchData();
      }
    } catch (error) {
      notification.error({ message: "Failed to delete category" });
    }
  };

  const handleStatus = async (status, value) => {
    try {
      const formData = {
        name: value.name,
        image: value.image,
        status: status,
      };

      await axios.put(
        `${process.env.REACT_APP_URL}/updatecategory/${value._id}`,
        formData
      );
      fetchData();
      notification.success({ message: "Status updated successfully" });
    } catch (err) {
      notification.error({message:"Something went wrong"})
    }
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
      title: <h1 className="text-[10px] md:text-[14px]">Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
        return (
          <Image
            alt="logo"
            className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
            src={name}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
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

  const partnerColumns = [
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
      title: <h1 className="text-[10px] md:text-[14px]">Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
        return (
          <Image
            alt="logo"
            className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
            src={name}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
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
  ];

  return (
    <div className="mt-28 md:pl-[20vw]">
      <div className="w-[80vw]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
          className="lg:!w-[78vw]"
        >
          <Panel
            header={
              <h1 className="text-md !text-[#CD5C08] font-semibold">
                Cuisines
              </h1>
            }
            extra={
              <div
                className="cursor-pointer"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <FileAddOutlined
                  className={`!text-[#CD5C08] !text-xl ${
                    get(user, "name")?.split("@")?.includes("partner")
                      ? "!hidden"
                      : "!block"
                  }`}
                />
              </div>
            }
            key="1"
          >
            <div className="flex flex-col ">
              <div className="flex flex-col gap-y-2">
                <div className="p-2 ">
                  <Spin spinning={loading}>
                    <Table
                      key="id"
                      size="middle"
                      pagination={{
                        pageSize: 5,
                        current: currentPage,
                        onChange: (page) => {
                          setCurrentPage(page);
                        },
                      }}
                      columns={
                        get(user, "name")?.split("@")?.includes("partner")
                          ? partnerColumns
                          : columns
                      }
                      dataSource={data}
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
        onCancel={() => {
          setOpen(!open);
          form.resetFields();
          setImageUrl("");
          setIsAvailable(false);
          setFileList([]);
        }}
        width={400}
        title={<p>Add Cuisines</p>}
        footer={false}
        destroyOnClose
      >
        <Form
          layout="vertical"
          className="pt-3"
          onFinish={handleFinish}
          form={form}
        >
          <Form.Item
            name="name"
            label="Cuisine Name"
            rules={[
              {
                required: true,
                message: "Please enter subcategory",
              },
            ]}
          >
            <Input type="text" placeholder="Category name..." size="large" />
          </Form.Item>
          <Form.Item
            label="Cuisines Availability"
            name="status"
            className="mb-0"
          >
            <Switch
              checked={isAvailable}
              onChange={(checked) => setIsAvailable(checked)}
            />
          </Form.Item>
          <Form.Item
            name="img"
            rules={[
              {
                required: updateId === "" ? true : false,
                message: "Select cuisine image",
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
          <Form.Item>
            <div className="flex gap-3 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                  setImageUrl("");
                  setIsAvailable(false);
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
      </Modal>
    </div>
  );
}

export default Category;
